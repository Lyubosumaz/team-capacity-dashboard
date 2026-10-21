#!/usr/bin/env node

const { spawn } = require('node:child_process');
const http = require('node:http');

const DEV_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

function waitForServer(url, timeoutMs = 60000, intervalMs = 1000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    function check() {
      const elapsed = Date.now() - start;
      if (elapsed > timeoutMs) {
        return reject(
          new Error(`Server at ${url} did not become ready in ${timeoutMs}ms`),
        );
      }

      const req = http.get(url, (res) => {
        res.resume();
        resolve(true);
      });

      req.on('error', () => {
        setTimeout(check, intervalMs);
      });
    }

    check();
  });
}

async function main() {
  const dev = spawn('pnpm', ['dev'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  let devExited = false;
  dev.on('exit', (code) => {
    devExited = true;
    if (code !== 0) {
      console.error(`Dev server exited early with code ${code}`);
    }
  });

  try {
    await waitForServer(DEV_URL);
  } catch (err) {
    console.error(String(err));
    if (!devExited) dev.kill('SIGINT');
    process.exit(1);
  }

  const cypress = spawn('pnpm', ['exec', 'cypress', 'run'], {
    stdio: 'inherit',
    shell: true,
  });

  cypress.on('exit', (code) => {
    if (!devExited) {
      dev.kill('SIGINT');
    }
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
