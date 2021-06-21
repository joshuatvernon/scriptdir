import chalk from 'chalk';

import { config } from '../../config';
import { constants } from '../../constants';
import { loader } from '../../loader';
import { menu } from '../../menu';
import { runner } from '../../runner';
import { PathUtils, StringUtils, TypeUtils } from '../../utils';
export const execute = async (repoName?: string, verbose?: boolean): Promise<void> => {
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
    if (StringUtils.isNotBlank(repo.path)) {
      const directory = loader.loadDirectory(repo.path as string);
      runner.runDirectory(directory, undefined, { verbose });
    } else {
      const directory = loader.loadDirectory(PathUtils.resolve(constants.reposPath, repo.name));
      runner.runDirectory(directory.directories[0], undefined, { verbose });
    }
  } else {
    console.log(`No ${chalk.magentaBright.bold(repoName)} repo to execute`);
    process.exit();
  }
};
