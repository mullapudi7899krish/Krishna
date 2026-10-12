const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const port = process.env.PORT || '4100';
const serverScript = path.join(projectRoot, 'server.js');
const cucumberScript = path.join(projectRoot, 'node_modules', '@cucumber', 'cucumber', 'bin', 'cucumber.js');

function waitForServer() {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const check = () => {
      const req = http.get(`http://localhost:${port}/api/health`, (res) => {
        res.resume();
        if (res.statusCode === 200) {
          resolve();
          return;
        }

        if (Date.now() - startedAt > 20000) {
          reject(new Error(`Bank app did not become healthy on port ${port}`));
          return;
        }

        setTimeout(check, 250);
      });

      req.on('error', () => {
        if (Date.now() - startedAt > 20000) {
          reject(new Error(`Bank app failed to start on port ${port}`));
          return;
        }

        setTimeout(check, 250);
      });
    };

    check();
  });
}

async function main() {
  const server = spawn(process.execPath, [serverScript], {
    cwd: projectRoot,
    env: { ...process.env, PORT: port },
    stdio: 'inherit',
  });

  try {
    await waitForServer();

    const cucumber = spawn(process.execPath, [cucumberScript, '--require', './tests/steps/**/*.js', './tests/features/**/*.feature'], {
      cwd: projectRoot,
      env: { ...process.env, PORT: port },
      stdio: 'inherit',
    });

    const exitCode = await new Promise((resolve) => {
      cucumber.on('exit', (code) => resolve(code ?? 0));
    });

    process.exitCode = exitCode;
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
