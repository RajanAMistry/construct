import { createServer as createHttpServer } from 'node:http';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function createServer() {
  return createHttpServer((request, response) => {
    const healthy = request.method === 'GET' && request.url === '/health';
    response.writeHead(healthy ? 200 : 404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(healthy ? { status: 'ok' } : { error: 'Not found' }));
  });
}

function start() {
  const rawPort = process.env.PORT ?? '3000';
  if (!/^\d+$/.test(rawPort) || !Number.isInteger(Number(rawPort)) || Number(rawPort) > 65535) {
    console.error('PORT must be a decimal integer from 0 to 65535.');
    process.exitCode = 1;
    return;
  }

  const server = createServer();
  server.on('error', (error) => {
    console.error(`Server error: ${error.code}`);
    process.exitCode = 1;
  });
  server.listen(Number(rawPort), '127.0.0.1', () => {
    console.log(`Listening on http://127.0.0.1:${server.address().port}`);
  });
  process.once('SIGINT', () => {
    server.close((error) => {
      process.exitCode = error ? 1 : 0;
    });
  });
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  start();
}
