import chalk from 'chalk';

import { config } from '../../config';
import { Repo } from '../../config/types';
import { constants } from '../../constants';
import { menu } from '../../menu';
import { runner } from '../../runner';
import { PathUtils } from '../../utils';

const addRepo = async (repo: Repo) => {
  console.log('');
  PathUtils.createDirectory(PathUtils.resolve(constants.reposPath, repo.name));
  await runner.runCommand(`git clone ${repo.url}`, PathUtils.resolve(constants.reposPath, repo.name));
  config.updateRepos([...config.repos, repo]);
  config.save();
};

export const add = async (repoName: string, repoUrl: string): Promise<void> => {
  const repoNames = config.repos.map((repo) => repo.name);
  if (repoNames.includes(repoName)) {
    menu.start();
    console.log(`${chalk.magenta(repoName)} is already saved as a repo\n`);
    const userConfirmedOverrideRepo = await menu.confirm(`Override ${repoName} repo?`);
    if (userConfirmedOverrideRepo) {
      PathUtils.removeDirectory(PathUtils.resolve(constants.reposPath, repoName));
      addRepo({ name: repoName, url: repoUrl });
    }
    menu.stop();
  } else {
    console.log(`Adding ${chalk.magenta(repoName)} repo`);
    addRepo({ name: repoName, url: repoUrl });
  }
};
