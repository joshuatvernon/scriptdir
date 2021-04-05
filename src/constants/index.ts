import { PathUtils } from '../utils';

class Constants {
  public programName = 'scriptrepo';
  public version = '1.0.0';
  public description = '';
  public configPath = PathUtils.resolve(`${__dirname}/../config/config.json`);
  public reposPath = PathUtils.resolve(`${__dirname}/../config/repos`);
}

export const constants = new Constants();
