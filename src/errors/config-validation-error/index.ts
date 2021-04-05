import { StringUtils } from '../../utils';

export enum ConfigValidationType {
  InvalidFieldValue = 'InvalidFieldValue',
  InvalidFieldType = 'InvalidFieldType',
  RequiredFieldValueMissing = 'RequiredFieldValueMissing'
}

// The default field value is set to an extremely random string so we can compare it to the currently set field value
// to know if the field value has been set to 'null' or 'undefined' or '""'
const DEFAULT_FIELD_VALUE = '~)!*%#$+=!@;"?/';

export class ConfigValidationErrorBuilder {
  private configName: string;
  private validationType: ConfigValidationType;
  private fieldName?: string;
  private fieldValue: string = DEFAULT_FIELD_VALUE;
  private message?: string;

  constructor(configName: string, validationType: ConfigValidationType) {
    this.configName = configName;
    this.validationType = validationType;
  }

  withFieldName(fieldName: string): ConfigValidationErrorBuilder {
    this.fieldName = fieldName;
    return this;
  }

  withFieldValue(fieldValue: string): ConfigValidationErrorBuilder {
    this.fieldValue = fieldValue;
    return this;
  }

  withMessage(message: string): ConfigValidationErrorBuilder {
    this.message = message;
    return this;
  }

  build(): ConfigValidationError {
    let message = `${this.configName}: `;
    switch (this.validationType) {
      case ConfigValidationType.InvalidFieldValue:
        message += `${this.fieldValue === DEFAULT_FIELD_VALUE ? '' : `"${this.fieldValue}" is an `}invalid "${
          this.fieldName
        }" field value.${StringUtils.isBlank(this.message) ? '' : ` ${this.message}`}`;
        break;
      case ConfigValidationType.InvalidFieldType:
        message += `${this.fieldValue === DEFAULT_FIELD_VALUE ? '' : `"${this.fieldValue}" is an `}invalid type for "${
          this.fieldName
        }" field value.${StringUtils.isBlank(this.message) ? '' : ` ${this.message}`}`;
        break;
      case ConfigValidationType.RequiredFieldValueMissing:
        message += `"${this.fieldName}" required field is missing.${
          StringUtils.isBlank(this.message) ? '' : ` ${this.message}`
        }`;
        break;
    }
    return new ConfigValidationError(message);
  }
}

export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigValidationError';
  }
  public static builder(configName: string, validationType: ConfigValidationType): ConfigValidationErrorBuilder {
    return new ConfigValidationErrorBuilder(configName, validationType);
  }
}
