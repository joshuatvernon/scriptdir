import chalk from 'chalk';

import { config } from '../../config';
import { Repo } from '../../config/types';
import { constants } from '../../constants';
import { loader } from '../../loader';
import { Directory, Script } from '../../types';
import { PathUtils, StringUtils } from '../../utils';

export const list = (verbose?: boolean): void => {
  if (config.repos.length > 0) {
    console.log('Repos:');
    config.repos.forEach((repo) => {
      console.log(`\n${chalk.magentaBright.bold(repo.name)}`);
      console.log(`- name: ${chalk.cyan(repo.name)}`);
      if (StringUtils.isNotBlank(repo.url)) {
        console.log(`- url: ${chalk.cyan(repo.url)}`);
      }
      if (StringUtils.isNotBlank(repo.path)) {
        console.log(`- path: ${chalk.cyan(repo.path)}`);
      }
      if (verbose) {
        logRepoIds(repo);
      }
    });
  } else {
    console.log('No repos');
  }
};

const logRepoIds = (repo: Repo): void => {
  console.log('- ids');
  let loadedDirectory;
  if (StringUtils.isNotBlank(repo.path)) {
    const loadedDirectories = loader.loadDirectory(repo.path as string, []);
    loadedDirectory = loadedDirectories[0];
  } else {
    const loadedDirectories = loader.loadDirectory(PathUtils.resolve(constants.reposPath, repo.name), []);
    loadedDirectory = loadedDirectories[0].directories[0];
  }
  logDirectory(loadedDirectory, 1);
};

const logDirectory = (directory: Directory, depth: number): void => {
  if (directory.config && directory.config.id) {
    console.log(
      `${Array(depth * 2).join(' ')}- ${chalk.cyan(directory.config.id)}${
        directory.config.description ? `: ${directory.config.description}` : ''
      }`
    );
  }
  directory.directories.forEach((childDirectory: Directory) => {
    logDirectory(childDirectory, depth + 1);
  });
  directory.scripts.forEach((childScript: Script) => {
    if (childScript.config && childScript.config.id) {
      console.log(
        `${Array((depth + 1) * 2).join(' ')}- ${chalk.cyan(childScript.config.id)}${
          childScript.config.description ? `: ${childScript.config.description}` : ''
        }`
      );
    }
  });
};
