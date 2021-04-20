import chalk from 'chalk';

import { runner } from '..';
import { constants } from '../../constants';
import { menu } from '../../menu';
import { Argument, Input, Script } from '../../types';
import { StringUtils } from '../../utils';

const getInput = async (input: Input, options?: { verbose?: boolean }) => {
  let question = chalk.magentaBright.bold(input.displayName ? input.displayName : input.name);
  if (input.required === true) {
    question += ` (required)`;
  }
  if (StringUtils.isNotBlank(input.example)) {
    question += ` (e.g. ${input.example})`;
  }
  if (options && options.verbose === true && StringUtils.isNotBlank(input.description)) {
    question += `: ${input.description}`;
  }
  if (input.options && Array.isArray(input.options) && input.options.length > 0) {
    return await menu.list(
      question,
      input.required === true ? input.options : [...input.options, constants.commands.skip]
    );
  } else {
    if (input.type === 'boolean' || input.type === 'flag') {
      return (await menu.confirm(question)) ? 'true' : 'false';
    }
    return await menu.input(question);
  }
};

const getInputs = async (inputs: Input[], options?: { verbose?: boolean }) => {
  for (const input of inputs) {
    if ((input as Argument).repeated) {
      input.value = [];
      do {
        if (
          (!input.options || input.options.length === 0) &&
          input.value.length > 0 &&
          input.value[input.value.length - 1] === ''
        ) {
          break;
        }
        if (input.required === true && input.value.length > 0) {
          input.required = false;
        }
        input.value.push(await getInput(input, options));
      } while (input.value[input.value.length - 1] !== constants.commands.skip);
      if (!input.allowEmpty) {
        input.value = input.value.filter((value) => value !== '');
      }
    } else {
      input.value = await getInput(input, options);
      if (input.value === '' && !input.allowEmpty) {
        input.value = constants.commands.skip;
      }
    }
  }
  return inputs;
};

export const runScript = async (script: Script, options?: { verbose?: boolean }): Promise<void> => {
  if (script.extension === 'sh' && !script.executable) {
    console.warn(`${chalk.magentaBright.bold(script.name)} may not be executable. Trying to execute anyway\n`);
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
      command = `npx ts-node --script-mode --transpile-only ${script.path}`;
      break;
    case 'py':
      command = `python3 ${script.path}`;
      break;
    default:
      throw new Error(
        `Cannot run ${chalk.magentaBright.bold(script.name)} because ${chalk.magentaBright.bold(
          script.extension
        )} files are not a supported`
      );
  }

  let beforeCommand = '';
  const environmentVariables = await getInputs(script.config?.environmentVariables ?? [], options);
  environmentVariables.forEach((environmentVariable) => {
    if (environmentVariable.value !== constants.commands.skip) {
      if (environmentVariable.value && Array.isArray(environmentVariable.value)) {
        environmentVariable.value.forEach((value) => {
          if (value !== constants.commands.skip) {
            if (environmentVariable.type === 'string') {
              beforeCommand += `${environmentVariable.name}=${JSON.stringify(value)} `;
            } else {
              beforeCommand += `${environmentVariable.name}=${value} `;
            }
          }
        });
      } else {
        beforeCommand += `${environmentVariable.name}=${
          environmentVariable.type === 'string' ? JSON.stringify(environmentVariable.value) : environmentVariable.value
        } `;
      }
    }
  });
  let afterCommand = '';
  const args = await getInputs(script.config?.arguments ?? [], options);
  args.forEach((argument) => {
    if (argument.value !== constants.commands.skip && !(argument.type === 'flag' && argument.value === 'false')) {
      if (argument.value && Array.isArray(argument.value)) {
        argument.value.forEach((value) => {
          if (value !== constants.commands.skip && !(argument.type === 'flag' && value === 'false')) {
            afterCommand += ` ${argument.name.length === 1 ? '-' : '--'}${argument.name} ${
              argument.type === 'flag' ? '' : argument.type === 'string' ? JSON.stringify(value) : value
            }`;
          }
        });
      } else {
        afterCommand += ` ${argument.name.length === 1 ? '-' : '--'}${argument.name} ${
          argument.type === 'flag' ? '' : argument.type === 'string' ? JSON.stringify(argument.value) : argument.value
        }`;
      }
    }
  });

  let userConfirmedRunScript = true;
  if (script.config && script.config.askForConfirmation) {
    userConfirmedRunScript = await menu.confirm(`Run ${chalk.magentaBright.bold(script.name)} script?`);
    if (userConfirmedRunScript) {
      console.log('');
    }
  }

  menu.stop();

  if (userConfirmedRunScript) {
    await runner.runCommand(beforeCommand + command + afterCommand, undefined, options);
  }
};
