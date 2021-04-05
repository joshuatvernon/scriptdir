import chalk from 'chalk';

import { runner } from '..';
import { menu } from '../../menu';
import { Directory, Script } from '../../types';

export const runDirectory = async (
  directory: Directory,
  parentDirectory?: Directory,
  options?: { verbose?: boolean }
): Promise<any> => {
  if (!directory) {
    return null;
  }
  const { name, scripts, directories } = directory;
  const scriptNames = scripts.map((script) => `${chalk.green('$ ')}${script.name}`);
  const directoryNames = directories.map((directory) => directory.name);
  const choices = [
    ...scriptNames,
    ...directoryNames,
    parentDirectory !== undefined ? 'Go back' : undefined,
    'Quit'
  ].filter((choice) => choice !== undefined) as string[];
  const answer = await menu.list(chalk.magenta(`${name}`), choices);
  if (answer.includes(chalk.green('$ '))) {
    const scriptName = answer.slice(chalk.green('$ ').length);
    const script = directory.scripts.find((script) => script.name === scriptName) as Script;
    await runner.runScript(script, options);
    return null;
  } else if (answer.includes('Go back')) {
    return parentDirectory;
  } else if (answer.includes('Quit')) {
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
