import chalk from 'chalk';

import { config } from '../../config';

export const list = (): void => {
  if (config.repos.length > 0) {
    console.log('Repos:');
    config.repos.forEach((repo) => {
      console.log(`\n${chalk.magenta(repo.name)}`);
      console.log(`- name: ${chalk.cyan(repo.name)}`);
      console.log(`- url: ${chalk.cyan(repo.url)}`);
    });
  } else {
    console.log('No repos');
  }
};
