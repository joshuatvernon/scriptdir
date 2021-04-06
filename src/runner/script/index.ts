import chalk from 'chalk';

import { runner } from '..';
import { menu } from '../../menu';
import { Argument, EnvironmentVariable, Script } from '../../types';

const getEnvironmentVariables = async (environmentVariables: EnvironmentVariable[]) => {
  for (const environmentVariable of environmentVariables) {
    const value = await menu.input(environmentVariable.name);
    environmentVariable.value = value;
  }
  return environmentVariables;
};

const getArguments = async (args: Argument[]) => {
  for (const arg of args) {
    const value = await menu.input(arg.name);
    arg.value = value;
  }
  return args;
};

export const runScript = async (script: Script, options?: { verbose?: boolean }): Promise<void> => {
  if (!script.executable) {
    console.warn(`${chalk.magenta(script.name)} may not be executable. Trying to execute anyway\n`);
  }
  let command;
  switch (script.extension.toLowerCase()) {
    case 'sh':
      command = `${script.path}`;
      break;
    case 'js':
      command = `node ${script.path}`;
      break;
    case 'ts':
      command = `npx ts-node ${script.name}`;
      break;
    case 'py':
      command = `python3 ${script.path}`;
      break;
    default:
      throw new Error(
        `Cannot run ${chalk.magenta(script.name)} because ${chalk.magenta(script.extension)} files are not a supported`
      );
  }

  let beforeCommand = '';
  const environmentVariables = await getEnvironmentVariables(script.config?.environmentVariables ?? []);
  environmentVariables.forEach((environmentVariable) => {
    beforeCommand += `${environmentVariable.name}=${environmentVariable.value} `;
  });
  let afterCommand = '';
  const args = await getArguments(script.config?.arguments ?? []);
  args.forEach((argument) => {
    afterCommand += ` ${argument.name.length === 1 ? '-' : '--'}${argument.name} ${argument.value}`;
  });

  let userConfirmedRunScript = true;
  if (script.config && script.config.askForConfirmation) {
    userConfirmedRunScript = await menu.confirm(`Run ${chalk.magenta(script.name)} script?`);
    if (userConfirmedRunScript) {
      console.log('');
    }
  }

  menu.stop();

  if (userConfirmedRunScript) {
    await runner.runCommand(beforeCommand + command + afterCommand, undefined, options);
  }
};
