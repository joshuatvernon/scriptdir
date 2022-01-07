import { constants } from '../../constants';
import { Directory, DirectoryConfig, Script, ScriptConfig } from '../../types';
import { PathUtils } from '../../utils';
import { validateDirectoryConfig, validateScriptConfig } from '../../validation';

const SCRIPT_CONFIG_FILE_NAME_SUFFIX = `.${constants.programName}.json`;

const loadScriptConfig = (
  path: string,
  fileName: string,
  fileNames: string[],
  directoryAndScriptConfigIds: string[]
): [ScriptConfig | undefined, string[]] => {
  const scriptConfigFileName = `${PathUtils.getFileNameWithoutExtension(fileName)}${SCRIPT_CONFIG_FILE_NAME_SUFFIX}`;
  let config;
  if (fileNames.includes(scriptConfigFileName)) {
    config = PathUtils.getJsonFile(PathUtils.resolve(path, scriptConfigFileName)) as ScriptConfig;
  } else if (fileNames.includes(`.${scriptConfigFileName}`)) {
    config = PathUtils.getJsonFile(PathUtils.resolve(path, `.${scriptConfigFileName}`)) as ScriptConfig;
  }
  if (config) {
    validateScriptConfig(config, PathUtils.resolve(path, scriptConfigFileName), directoryAndScriptConfigIds);
    if (config && config.id) {
      // Add script config id to directory and script config ids
      directoryAndScriptConfigIds.push(config?.id);
    }
  }
  return [config, directoryAndScriptConfigIds];
};

const loadScripts = (
  path: string,
  directoryAndScriptConfigIds: string[],
  directoryConfig?: DirectoryConfig
): [Script[], string[]] => {
  const fileNames = PathUtils.getFileNames(path).filter((scriptName) => {
    const isExcludedScript = directoryConfig && directoryConfig.exclude && directoryConfig.exclude.includes(scriptName);
    return !isExcludedScript;
  });
  const scripts: Script[] = [];
  for (const fileName of fileNames) {
    if (fileName.endsWith(SCRIPT_CONFIG_FILE_NAME_SUFFIX)) {
      continue;
    }
    const [scriptConfig, newDirectoryAndScriptConfigIds] = loadScriptConfig(
      path,
      fileName,
      fileNames,
      directoryAndScriptConfigIds
    );
    directoryAndScriptConfigIds = newDirectoryAndScriptConfigIds;
    const script: Script = {
      name: PathUtils.getFileNameWithoutExtension(fileName),
      path: PathUtils.resolve(path, fileName),
      extension: PathUtils.getFileExtensionWithoutFileName(fileName),
      config: scriptConfig,
      executable: PathUtils.isFileExecutable(PathUtils.resolve(path, fileName))
    };
    scripts.push(script);
  }
  return [scripts, directoryAndScriptConfigIds];
};

const DIRECTORY_CONFIG_FILE_NAME = `${constants.programName}.json`;

const loadDirectoryConfig = (
  path: string,
  directoryAndScriptConfigIds: string[]
): [DirectoryConfig | undefined, string[]] => {
  const fileNames = PathUtils.getFileNames(path);
  let config;
  if (fileNames.includes(DIRECTORY_CONFIG_FILE_NAME)) {
    config = PathUtils.getJsonFile(PathUtils.resolve(path, DIRECTORY_CONFIG_FILE_NAME)) as DirectoryConfig;
  } else if (fileNames.includes(`.${DIRECTORY_CONFIG_FILE_NAME}`)) {
    config = PathUtils.getJsonFile(PathUtils.resolve(path, `.${DIRECTORY_CONFIG_FILE_NAME}`)) as DirectoryConfig;
  }

  if (config !== undefined) {
    validateDirectoryConfig(config, PathUtils.resolve(path, DIRECTORY_CONFIG_FILE_NAME), directoryAndScriptConfigIds);
    if (config && config.id) {
      // Add directory config id to directory and script config ids
      directoryAndScriptConfigIds.push(config?.id);
    }
  }

  return [config, directoryAndScriptConfigIds];
};

export const loadDirectory = (path: string, directoryAndScriptConfigIds: string[]): [Directory, string[]] => {
  const name = PathUtils.getDirectoryName(path);
  const loadedDirectoryConfig = loadDirectoryConfig(path, directoryAndScriptConfigIds);
  const config = loadedDirectoryConfig[0];
  directoryAndScriptConfigIds = loadedDirectoryConfig[1];
  const loadedScripts = loadScripts(path, directoryAndScriptConfigIds, config);
  const scripts = loadedScripts[0];
  directoryAndScriptConfigIds = loadedScripts[1];
  const directoryNames = PathUtils.getDirectoryNames(path);
  const directories = directoryNames
    .filter((directoryName) => {
      const isBlocklistedDirectory = constants.directoryBlocklist.includes(directoryName);
      const isExcludedDirectory = config && config.exclude && config.exclude.includes(directoryName);
      return !isBlocklistedDirectory && !isExcludedDirectory;
    })
    .map((directoryName) => {
      const loadedDirectory = loadDirectory(PathUtils.resolve(path, directoryName), directoryAndScriptConfigIds);
      directoryAndScriptConfigIds = loadedDirectory[1];
      return loadedDirectory[0];
    });
  const directory: Directory = {
    name,
    path,
    scripts,
    directories,
    config
  };
  return [directory, directoryAndScriptConfigIds];
};
