import chalk from 'chalk';

import { config } from '../../config';
import { Repo } from '../../config/types';
import { constants } from '../../constants';
import { menu } from '../../menu';
import { runner } from '../../runner';
import { PathUtils, StringUtils } from '../../utils';

const addRepo = async (newRepo: Repo, silent?: boolean) => {
  if (StringUtils.isNotBlank(newRepo.path)) {
    newRepo.path = PathUtils.resolve(newRepo.path as string);
  } else {
    if (silent !== true) {
      console.log('');
    }
    PathUtils.createDirectory(PathUtils.resolve(constants.reposPath, newRepo.name));
    await runner.runCommand(`git clone ${newRepo.url}`, PathUtils.resolve(constants.reposPath, newRepo.name), {
      silent
    });
  }
  config.updateRepos([...config.repos.filter((repo) => repo.name !== newRepo.name), newRepo]);
  config.save();
};

export const add = async (
  name: string,
  url?: string,
  path?: string,
  force?: boolean,
  silent?: boolean
): Promise<void> => {
  if (StringUtils.isNotBlank(url) && StringUtils.isNotBlank(path)) {
    console.error(`${chalk.red('url')} and ${chalk.red('path')} are incompatible`);
    return;
  }
  const repo = config.getRepoByRepoName(name);
  if (repo) {
    menu.start();
    if (silent !== true) {
      console.log(`${chalk.magentaBright.bold(name)} is already saved as a repo\n`);
    }
    let userConfirmedOverrideRepo = true;
    if (force !== true) {
      userConfirmedOverrideRepo = await menu.confirm(`Override ${name} repo?`);
    } else {
      if (silent !== true) {
        console.log(`Overriding ${chalk.magentaBright.bold(name)} repo`);
      }
    }
    if (userConfirmedOverrideRepo) {
      if (repo.url) {
        PathUtils.removeDirectory(PathUtils.resolve(constants.reposPath, name));
      }
      addRepo({ name, url, path }, silent);
    }
    menu.stop();
  } else {
    if (silent !== true) {
      console.log(`Adding ${chalk.magentaBright.bold(name)} repo`);
    }
    addRepo({ name, url, path }, silent);
  }
};
