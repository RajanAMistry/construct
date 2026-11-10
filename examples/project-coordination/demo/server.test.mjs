import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { request } from 'node:http';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createServer } from './server.mjs';

const entry = fileURLToPath(new URL('./server.mjs', import.meta.url));

async function startServer(t) {
  const server = createServer();
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return server.address().port;
}

function getResponse(port, path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = request({ host: '127.0.0.1', port, path, method }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body }));
      response.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(2000, () => req.destroy(new Error('Request timed out')));
    req.end();
  });
}

test('GET /health returns the JSON health response', async (t) => {
  const port = await startServer(t);
  const response = await getResponse(port, '/health');
  assert.equal(response.status, 200);
  assert.equal(response.headers['content-type'], 'application/json');
  assert.deepEqual(JSON.parse(response.body), { status: 'ok' });
});

test('an unknown path returns a JSON 404', async (t) => {
  const port = await startServer(t);
  const response = await getResponse(port, '/missing');
  assert.equal(response.status, 404);
  assert.equal(response.headers['content-type'], 'application/json');
  assert.deepEqual(JSON.parse(response.body), { error: 'Not found' });
});

test('POST /health does not use the GET route', async (t) => {
  const port = await startServer(t);
  const response = await getResponse(port, '/health', 'POST');
  assert.equal(response.status, 404);
  assert.deepEqual(JSON.parse(response.body), { error: 'Not found' });
});

test('HEAD /health returns 404 without a body', async (t) => {
  const port = await startServer(t);
  const response = await getResponse(port, '/health', 'HEAD');
  assert.equal(response.status, 404);
  assert.equal(response.body, '');
});

test('invalid PORT values fail before the server starts', async (t) => {
  for (const port of ['', '-1', '65536', '3.5', 'abc', ' 3000', '1e3']) {
    await t.test(JSON.stringify(port), () => {
      const result = spawnSync(process.execPath, [entry], {
        env: { ...process.env, PORT: port }, encoding: 'utf8', timeout: 3000,
      });
      assert.equal(result.error, undefined);
      assert.equal(result.status, 1);
      assert.equal(result.stdout, '');
      assert.equal(result.stderr.trim(), 'PORT must be a decimal integer from 0 to 65535.');
    });
  }
});

test('PORT=0 prints the listening URL and Ctrl-C stops the server', async (t) => {
  const child = spawn(process.execPath, [entry], {
    env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const closed = once(child, 'close');
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    await closed;
  });
  const output = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Startup timed out')), 3000);
    let text = '';
    child.on('error', reject);
    child.stdout.on('data', (chunk) => {
      text += chunk;
      if (text.includes('\n')) {
        clearTimeout(timer);
        resolve(text.trim());
      }
    });
  });
  const match = /^Listening on http:\/\/127\.0\.0\.1:(\d+)$/.exec(output);
  assert.ok(match, output);
  const port = Number(match[1]);
  assert.ok(port > 0 && port <= 65535);
  assert.equal((await getResponse(port, '/health')).status, 200);
  child.kill('SIGINT');
  const [code, signal] = await closed;
  assert.equal(code, 0);
  assert.equal(signal, null);
  await assert.rejects(getResponse(port, '/health'), { code: 'ECONNREFUSED' });
});
