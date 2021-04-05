import { spawn } from 'child_process';

export const runCommand = async (
  command: string,
  cwd?: string,
  options?: { silent?: boolean; verbose?: boolean }
): Promise<void> => {
  if (options && options.verbose) {
    console.log(`${command}\n`);
  }
  const childProcess = spawn(command, {
    cwd: cwd ? cwd : process.cwd(),
    shell: process.env.SHELL,
    stdio: options && options.silent ? 'ignore' : 'inherit',
    detached: true
  });
  return new Promise((resolve, reject) => {
    childProcess.on('error', reject);
    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
        process.exit();
      }
    });
    process.on('SIGINT', () => {
      reject();
      process.kill(-childProcess.pid, 'SIGINT');
    });
  });
};
