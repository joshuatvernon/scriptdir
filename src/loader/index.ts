import { loadDirectory } from './directory';

class Loader {
  loadDirectory = loadDirectory;
}

export const loader = new Loader();
