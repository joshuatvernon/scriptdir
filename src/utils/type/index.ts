const isString = (value: unknown): value is string => typeof value === 'string';
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const isNumber = (value: unknown): value is number => typeof value === 'number';
const isFunction = (value: unknown): boolean => typeof value === 'function';
const isObject = (value: unknown): boolean => typeof value === 'object';

export const TypeUtils = {
  isString,
  isBoolean,
  isNumber,
  isFunction,
  isObject
};
