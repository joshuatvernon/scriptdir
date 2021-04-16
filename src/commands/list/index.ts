import chalk from 'chalk';

import { config } from '../../config';
import { StringUtils } from '../../utils';

export const list = (): void => {
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
    });
  } else {
    console.log('No repos');
  }
};
