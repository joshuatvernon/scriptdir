import { runCommand } from './command';
import { runDirectory } from './directory';
import { runScript } from './script';

export const runner = {
  runCommand,
  runScript,
  runDirectory
};
