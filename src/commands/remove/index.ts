import chalk from 'chalk';

import { config } from '../../config';
import { constants } from '../../constants';
import { menu } from '../../menu';
import { PathUtils, StringUtils, TypeUtils } from '../../utils';

export const remove = async (repoName: string, force?: boolean): Promise<void> => {
  if (config.repos.length === 0) {
    console.log('No repos to remove');
    return;
  }

  menu.start();

  const repoNames = config.repos.map((repo) => repo.name);
  if (StringUtils.isBlank(repoName) || TypeUtils.isBoolean(repoName)) {
    repoName = await menu.list('repos', repoNames);
    console.log('');
  }

  if (repoNames.includes(repoName)) {
    const userConfirmedRemoveRepo = force === true ? true : await menu.confirm(`Remove ${repoName} repo`);
    if (userConfirmedRemoveRepo) {
      console.log(`${force === true ? '' : '\n'}Removing ${chalk.magenta(repoName)} repo`);
      PathUtils.removeDirectory(PathUtils.resolve(constants.reposPath, repoName));
      config.updateRepos(config.repos.filter((repo) => repo.name !== repoName));
      config.save();
    }
  }

  menu.stop();
};
