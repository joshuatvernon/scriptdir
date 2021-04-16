import { ConfigValidationError, ConfigValidationType } from '../../../errors';
import { ScriptConfig } from '../../../types';
import { StringUtils } from '../../../utils';

export const validateScriptConfig = (config: ScriptConfig, configName: string): void => {
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
  if (config.askForConfirmation && typeof config.askForConfirmation !== 'boolean') {
    throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
      .withFieldName('askForConfirmation')
      .build();
  }
  if (config.environmentVariables && !Array.isArray(config.environmentVariables)) {
    throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
      .withFieldName('environmentVariables')
      .build();
  }
  if (config.arguments && !Array.isArray(config.arguments)) {
    throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
      .withFieldName('arguments')
      .build();
  }
  if (config.environmentVariables && Array.isArray(config.environmentVariables)) {
    config.environmentVariables.forEach((environmentVariable, index) => {
      if (environmentVariable.name === null || environmentVariable.name === undefined) {
        throw ConfigValidationError.builder(configName, ConfigValidationType.RequiredFieldValueMissing)
          .withFieldName(`environmentVariables[${index}].name`)
          .build();
      }
      if (typeof environmentVariable.name !== 'string') {
        throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
          .withFieldName(`environmentVariables[${index}].name`)
          .build();
      }
      if (StringUtils.isBlank(environmentVariable.name)) {
        throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldValue)
          .withFieldName(`environmentVariables[${index}].name`)
          .withFieldValue(environmentVariable.name)
          .build();
      }
      if (environmentVariable.required !== undefined) {
        if (typeof environmentVariable.required !== 'boolean') {
          throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
            .withFieldName(`environmentVariables[${index}].required`)
            .build();
        }
        if (environmentVariable.required !== true && environmentVariable.required !== false) {
          throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldValue)
            .withFieldName(`environmentVariables[${index}].required`)
            .withFieldValue(environmentVariable.required)
            .build();
        }
      }
    });
  }
  if (config.arguments && !Array.isArray(config.arguments)) {
    throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
      .withFieldName('arguments')
      .build();
  }
  if (config.arguments && Array.isArray(config.arguments)) {
    config.arguments.forEach((argument, index) => {
      if (argument.name === null || argument.name === undefined) {
        throw ConfigValidationError.builder(configName, ConfigValidationType.RequiredFieldValueMissing)
          .withFieldName(`arguments[${index}].name`)
          .build();
      }
      if (typeof argument.name !== 'string') {
        throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
          .withFieldName(`arguments[${index}].name`)
          .build();
      }
      if (StringUtils.isBlank(argument.name)) {
        throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldValue)
          .withFieldName(`arguments[${index}].name`)
          .withFieldValue(argument.name)
          .build();
      }
      if (argument.displayName !== undefined) {
        if (typeof argument.displayName !== 'string') {
          throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
            .withFieldName(`arguments[${index}].displayName`)
            .build();
        }
        if (StringUtils.isBlank(argument.displayName)) {
          throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldValue)
            .withFieldName(`arguments[${index}].displayName`)
            .withFieldValue(argument.displayName)
            .build();
        }
      }
      if (argument.description !== undefined) {
        if (typeof argument.description !== 'string') {
          throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
            .withFieldName(`arguments[${index}].description`)
            .build();
        }
        if (StringUtils.isBlank(argument.description)) {
          throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldValue)
            .withFieldName(`arguments[${index}].description`)
            .withFieldValue(argument.description)
            .build();
        }
      }
      if (argument.required !== undefined) {
        if (typeof argument.required !== 'boolean') {
          throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
            .withFieldName(`arguments[${index}].required`)
            .build();
        }
        if (argument.required !== true && argument.required !== false) {
          throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldValue)
            .withFieldName(`arguments[${index}].required`)
            .withFieldValue(argument.required)
            .build();
        }
      }
      if (argument.repeated !== undefined) {
        if (typeof argument.repeated !== 'boolean') {
          throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
            .withFieldName(`arguments[${index}].repeated`)
            .build();
        }
        if (argument.repeated !== true && argument.repeated !== false) {
          throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldValue)
            .withFieldName(`arguments[${index}].repeated`)
            .withFieldValue(argument.repeated)
            .build();
        }
      }
      if (argument.options && !Array.isArray(argument.options)) {
        throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
          .withFieldName(`arguments[${index}].options`)
          .build();
      }
      if (argument.options && Array.isArray(argument.options)) {
        argument.options.forEach((option, optionIndex) => {
          if (option === null || option === undefined) {
            throw ConfigValidationError.builder(configName, ConfigValidationType.RequiredFieldValueMissing)
              .withFieldName(`arguments[${index}].options[${optionIndex}]`)
              .build();
          }
          if (typeof option !== 'string') {
            throw ConfigValidationError.builder(configName, ConfigValidationType.InvalidFieldType)
              .withFieldName(`arguments[${index}].options[${optionIndex}]`)
              .build();
          }
        });
      }
    });
  }
};
