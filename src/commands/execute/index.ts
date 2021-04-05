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

  if (repoName !== undefined && repoNames.includes(repoName)) {
    const directory = loader.loadDirectory(PathUtils.resolve(constants.reposPath, repoName));
    runner.runDirectory(directory.directories[0], undefined, { verbose });
  } else {
    console.log(`No ${chalk.magenta(repoName)} repo to execute`);
  }
};
