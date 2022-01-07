import chalk from 'chalk';

import { config } from '../../config';
import { constants } from '../../constants';
import { loader } from '../../loader';
import { menu } from '../../menu';
import { runner } from '../../runner';
import { Directory, Script } from '../../types';
import { PathUtils, StringUtils, TypeUtils } from '../../utils';

export const execute = async (repoName?: string, id?: string, verbose?: boolean): Promise<void> => {
  if (config.repos.length === 0) {
    console.log('No repos to execute');
    return;
  }

  menu.start();
  const repoNames = config.repos.map((repo) => repo.name);
  if (StringUtils.isBlank(repoName) || TypeUtils.isBoolean(repoName)) {
    if (config.repos.length === 1) {
      repoName = config.repos[0].name;
    } else {
      repoName = await menu.list('repos', repoNames);
    }
  }

  const repo = config.getRepoByRepoName(repoName);
  if (repo) {
    try {
      if (StringUtils.isNotBlank(repo.path)) {
        const loadedDirectory = loader.loadDirectory(repo.path as string, []);
        if (StringUtils.isNotBlank(id)) {
          executeWithId(loadedDirectory[0], repoName, id, verbose);
        } else {
          runner.runDirectory(loadedDirectory[0], undefined, { verbose });
        }
      } else {
        const loadedDirectory = loader.loadDirectory(PathUtils.resolve(constants.reposPath, repo.name), []);
        if (StringUtils.isNotBlank(id)) {
          executeWithId(loadedDirectory[0].directories[0], repoName, id, verbose);
        } else {
          runner.runDirectory(loadedDirectory[0].directories[0], undefined, { verbose });
        }
      }
    } catch (error) {
      console.log(`An exception occurred while executing\n\nError:\n${chalk.redBright.bold(error)}`);
      process.exit();
    }
  } else {
    console.log(`No ${chalk.magentaBright.bold(repoName)} repo to execute`);
    process.exit();
  }
};

const executeWithId = (directory: Directory, repoName?: string, id?: string, verbose?: boolean) => {
  const directoryById = findDirectoryById(directory, id);
  const scriptById = findScriptById(directory, id);
  if (directoryById) {
    runner.runDirectory(directoryById, undefined, { verbose });
  } else if (scriptById) {
    runner.runScript(scriptById, { verbose });
  } else {
    console.log(`No ${chalk.magentaBright.bold(id)} id in ${chalk.magentaBright.bold(repoName)} repo to execute`);
    process.exit();
  }
};

const findDirectoryById = (directory: Directory, id?: string): Directory | undefined => {
  if (directory && directory.config && directory.config.id && directory.config.id === id) {
    return directory;
  }
  for (const childDirectory of directory.directories) {
    const foundDirectory = findDirectoryById(childDirectory, id);
    if (foundDirectory) {
      return foundDirectory;
    }
  }
  return undefined;
};

const findScriptById = (directory: Directory, id?: string): Script | undefined => {
  for (const script of directory.scripts) {
    if (script && script.config && script.config.id && script.config.id === id) {
      return script;
    }
  }
  for (const childDirectory of directory.directories) {
    const foundScript = findScriptById(childDirectory, id);
    if (foundScript) {
      return foundScript;
    }
  }
  return undefined;
};
