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

  getRepoByRepoName(name?: string) {
    if (!name) {
      return undefined;
    }
    return this.repos.find((repo) => repo.name === name);
  }

  getRepoByRepoUrl(url: string) {
    if (!url) {
      return undefined;
    }
    return this.repos.find((repo) => repo.url === url);
  }

  getRepoByRepoPath(path: string) {
    if (!path) {
      return undefined;
    }
    return this.repos.find((repo) => repo.path === PathUtils.resolve(path));
  }
}

export const config = new Config();
