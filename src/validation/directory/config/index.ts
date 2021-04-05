import { ConfigValidationError, ConfigValidationType } from '../../../errors';
import { DirectoryConfig } from '../../../types';

export const validateDirectoryConfig = (config: DirectoryConfig, configName: string): void => {
  if (config.description && typeof config.description !== 'string') {
    throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
      .withFieldName('description')
      .build();
  }
  if (config.description === '') {
    throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldValue)
      .withFieldName('description')
      .withFieldValue(config.description)
      .build();
  }
  // if (config.include && !Array.isArray(config.include)) {
  //   throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
  //     .withFieldName('include')
  //     .build();
  // }
  // if (config.exclude && !Array.isArray(config.exclude)) {
  //   throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
  //     .withFieldName('exclude')
  //     .build();
  // }
};
