import chalk from 'chalk';

import { runner } from '..';
import { constants } from '../../constants';
import { menu } from '../../menu';
import { Directory, Script } from '../../types';
import { StringUtils } from '../../utils';

export const runDirectory = async (
  directory: Directory,
  parentDirectory?: Directory,
  options?: { verbose?: boolean }
): Promise<any> => {
  if (!directory) {
    return null;
  }
  const { name, scripts, directories, config } = directory;
  const scriptNames = scripts.map((script) => `${chalk.green('$ ')}${script.name}`);
  const directoryNames = directories.map((directory) => directory.name);
  const choices = [
    ...scriptNames,
    ...directoryNames,
    parentDirectory !== undefined ? constants.commands.back : undefined,
    constants.commands.quit
  ].filter((choice) => choice !== undefined) as string[];
  let question = chalk.magentaBright.bold(`${config && StringUtils.isNotBlank(config.name) ? config.name : name}`);
  if (options && options.verbose && config && StringUtils.isNotBlank(config.description)) {
    question += `: ${config.description}`;
  }
  const answer = await menu.list(question, choices);
  if (answer.includes(chalk.green('$ '))) {
    const scriptName = answer.slice(chalk.green('$ ').length);
    const script = directory.scripts.find((script) => script.name === scriptName) as Script;
    await runner.runScript(script, options);
    return null;
  } else if (answer.includes(constants.commands.back)) {
    return parentDirectory;
  } else if (answer.includes(constants.commands.quit)) {
    await menu.stop();
    process.exit();
  } else {
    const directoryName = answer;
    const subDirectory = directory.directories.find((subDirectory) => subDirectory.name === directoryName) as Directory;
    if (await runDirectory(subDirectory, directory, options)) {
      return await runDirectory(directory, parentDirectory, options);
    }
    return null;
  }
};
