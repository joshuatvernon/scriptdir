const isString = (value: unknown): boolean => typeof value === 'string';
const isBoolean = (value: unknown): boolean => typeof value === 'boolean';
const isNumber = (value: unknown): boolean => typeof value === 'number';
const isFunction = (value: unknown): boolean => typeof value === 'function';
const isObject = (value: unknown): boolean => typeof value === 'object';

export const TypeUtils = {
  isString,
  isBoolean,
  isNumber,
  isFunction,
  isObject
};
