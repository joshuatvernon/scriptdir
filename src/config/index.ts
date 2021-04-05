import { constants } from '../constants';
import { PathUtils } from '../utils';
import { Repo } from './types';

class Config {
  repos: Repo[] = [];

  load() {
    const { repos } = PathUtils.getJsonFile(constants.configPath) as { repos: Repo[] };
    if (!PathUtils.directoryExists(constants.reposPath)) {
      PathUtils.createDirectory(constants.reposPath);
    }
    this.repos = repos;
  }

  save() {
    PathUtils.saveJsonFile(constants.configPath, {
      repos: this.repos
    });
  }

  updateRepos(repos: Repo[]) {
    this.repos = repos;
  }
}

export const config = new Config();
