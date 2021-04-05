import chalk from 'chalk';

import { config } from '../../config';
import { Repo } from '../../config/types';
import { constants } from '../../constants';
import { menu } from '../../menu';
import { runner } from '../../runner';
import { PathUtils, StringUtils, TypeUtils } from '../../utils';

const updateRepo = async (repo: Repo, silent?: boolean) => {
  PathUtils.removeDirectory(PathUtils.resolve(constants.reposPath, repo.name));
  PathUtils.createDirectory(PathUtils.resolve(constants.reposPath, repo.name));
  await runner.runCommand(`git clone ${repo.url}`, PathUtils.resolve(constants.reposPath, repo.name), {
    silent
  });
};

export const update = async (repoName: string, forceUpdate?: boolean, silent?: boolean): Promise<void> => {
  if (!silent && config.repos.length === 0) {
    console.log('No repos to update');
    return;
  }

  if (StringUtils.isBlank(repoName) || TypeUtils.isBoolean(repoName)) {
    if (forceUpdate) {
      for (let i = 0; i < config.repos.length; i++) {
        if (!silent) {
          console.log(`${i === 0 ? '' : '\n'}Updating ${chalk.magenta(config.repos[i].name)} repo\n`);
        }
        await updateRepo(config.repos[i], silent);
      }
      return;
    }
    menu.start();
    const userConfirmedUpdateRepos = await menu.confirm(`Update all repos?`);
    if (userConfirmedUpdateRepos) {
      for (const repo of config.repos) {
        if (!silent) {
          console.log(`\nUpdating ${chalk.magenta(repo.name)} repo\n`);
        }
        await updateRepo(repo, silent);
      }
    }
    menu.stop();
  } else {
    const repoNames = config.repos.map((repo) => repo.name);
    if (repoNames.includes(repoName)) {
      if (forceUpdate) {
        await updateRepo(config.repos.find((repo) => repo.name === repoName) as Repo, silent);
        return;
      }

      menu.start();
      const userConfirmedUpdateRepo = await menu.confirm(`Update ${chalk.magenta(repoName)} repo?`);
      if (userConfirmedUpdateRepo) {
        if (!silent) {
          console.log(`\nUpdating ${chalk.magenta(repoName)} repo\n`);
        }
        await updateRepo(config.repos.find((repo) => repo.name === repoName) as Repo, silent);
      }
      menu.stop();
    } else {
      if (!silent) {
        console.log(`No ${chalk.magenta(repoName)} repo to update`);
      }
    }
  }
};
