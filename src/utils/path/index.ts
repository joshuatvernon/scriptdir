import fse from 'fs-extra';
import path from 'path';

const isFile = (path: string): boolean => fse.lstatSync(path).isFile();
const isDirectory = (path: string): boolean => fse.lstatSync(path).isDirectory();
const resolve = path.resolve;
const basename = path.basename;
const readFile = (path: string): string => {
  if (!fse.existsSync(path)) {
    throw new Error(`${path} file does not exist`);
  }
  return fse.readFileSync(path, 'utf8');
};
const readDirectory = fse.readdirSync;
const getFileNameWithoutExtension = (fileName: string): string =>
  fileName.includes('.') ? fileName.split('.').slice(0, -1).join('.') : fileName;
const getFileExtensionWithoutFileName = (fileName: string): string => fileName.split('.').pop() as string;
const getFileNames = (path: string): string[] =>
  readDirectory(path).filter((fileNameOrDirectoryName) => isFile(resolve(path, fileNameOrDirectoryName)));
const getDirectoryName = (path: string): string => basename(resolve(path));
const getDirectoryNames = (path: string): string[] =>
  readDirectory(path).filter((fileNameOrDirectoryName) => isDirectory(resolve(path, fileNameOrDirectoryName)));
const getJsonFile = (path: string): Record<string, unknown> | Array<unknown> => JSON.parse(readFile(path));
const saveJsonFile = (path: string, json: Record<string, unknown> | Array<unknown>): void =>
  fse.writeFileSync(path, JSON.stringify(json, null, 4));
const isFileExecutable = (path: string): boolean => {
  try {
    fse.accessSync(path, fse.constants.X_OK);
    return true;
  } catch {
    return false;
  }
};
const directoryExists = (path: string): boolean => fse.existsSync(path);
const createDirectory = (path: string): void => fse.mkdirSync(path);
const removeDirectory = (path: string): void => fse.rmSync(path, { recursive: true });

export const PathUtils = {
  isFile,
  isDirectory,
  resolve,
  basename,
  readFile,
  readDirectory,
  getFileNameWithoutExtension,
  getFileExtensionWithoutFileName,
  getFileNames,
  getDirectoryName,
  getDirectoryNames,
  getJsonFile,
  saveJsonFile,
  isFileExecutable,
  directoryExists,
  createDirectory,
  removeDirectory
};
