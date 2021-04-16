export interface DirectoryConfig {
  /** (default: "") */
  name?: string;
  /** (default: "") */
  description?: string;
  exclude?: string[];
}

export interface Input {
  name: string;
  displayName?: string;
  description?: string;
  type?: 'string' | 'boolean' | 'flag';
  options?: string[];
  /** (default: true) */
  required?: boolean;
  value?: string | string[];
  /** (default: false) */
  allowEmpty?: boolean;
  example?: string;
}

export type EnvironmentVariable = Input;

export interface Argument extends Input {
  /** (default: false) */
  repeated?: boolean;
}
export interface ScriptConfig {
  /** (default: "") */
  description?: string;
  /** (default: false) */
  askForConfirmation?: boolean;
  /** (default: []) */
  environmentVariables?: EnvironmentVariable[];
  /** (default: []) */
  arguments?: Argument[];
}

export interface Script {
  name: string;
  path: string;
  extension: string;
  config?: ScriptConfig;
  executable: boolean;
}

export interface Directory {
  name: string;
  path: string;
  scripts: Script[];
  directories: Directory[];
  config?: DirectoryConfig;
}
