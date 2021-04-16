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
        if (StringUtils.isNotBlank(config.repos[i].url)) {
          if (!silent) {
            console.log(`${i === 0 ? '' : '\n'}Updating ${chalk.magentaBright.bold(config.repos[i].name)} repo\n`);
          }
          await updateRepo(config.repos[i], silent);
        }
      }
      return;
    }
    menu.start();
    const userConfirmedUpdateRepos = await menu.confirm(`Update all repos?`);
    if (userConfirmedUpdateRepos) {
      for (const repo of config.repos) {
        if (StringUtils.isNotBlank(repo.url)) {
          if (!silent) {
            console.log(`\nUpdating ${chalk.magentaBright.bold(repo.name)} repo\n`);
          }
          await updateRepo(repo, silent);
        }
      }
    }
    menu.stop();
  } else {
    const repo = config.getRepoByRepoName(repoName);
    if (repo && StringUtils.isNotBlank(repo.url)) {
      if (forceUpdate) {
        await updateRepo(repo, silent);
        return;
      }

      menu.start();
      const userConfirmedUpdateRepo = await menu.confirm(`Update ${chalk.magentaBright.bold(repoName)} repo?`);
      if (userConfirmedUpdateRepo) {
        if (!silent) {
          console.log(`\nUpdating ${chalk.magentaBright.bold(repoName)} repo\n`);
        }
        await updateRepo(repo, silent);
      }
      menu.stop();
    } else {
      if (!silent) {
        console.log(`No ${chalk.magentaBright.bold(repoName)} repo to update`);
      }
    }
  }
};
