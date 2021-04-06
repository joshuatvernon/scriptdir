import chalk from 'chalk';

import { config } from '../../config';
import { Repo } from '../../config/types';
import { constants } from '../../constants';
import { menu } from '../../menu';
import { runner } from '../../runner';
import { PathUtils, StringUtils } from '../../utils';

const addRepo = async (repo: Repo) => {
  if (StringUtils.isNotBlank(repo.path)) {
    repo.path = PathUtils.resolve(repo.path as string);
  } else {
    console.log('');
    PathUtils.createDirectory(PathUtils.resolve(constants.reposPath, repo.name));
    await runner.runCommand(`git clone ${repo.url}`, PathUtils.resolve(constants.reposPath, repo.name));
  }
  config.updateRepos([...config.repos, repo]);
  config.save();
};

export const add = async (name: string, url?: string, path?: string): Promise<void> => {
  if (StringUtils.isNotBlank(url) && StringUtils.isNotBlank(path)) {
    console.error(`${chalk.red('url')} and ${chalk.red('path')} are incompatible`);
    return;
  }
  const repoNames = config.repos.map((repo) => repo.name);
  if (repoNames.includes(name)) {
    menu.start();
    console.log(`${chalk.magenta(name)} is already saved as a repo\n`);
    const userConfirmedOverrideRepo = await menu.confirm(`Override ${name} repo?`);
    if (userConfirmedOverrideRepo) {
      PathUtils.removeDirectory(PathUtils.resolve(constants.reposPath, name));
      addRepo({ name, url, path });
    }
    menu.stop();
  } else {
    console.log(`Adding ${chalk.magenta(name)} repo`);
    addRepo({ name, url, path });
  }
};
