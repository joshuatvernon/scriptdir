import { StringUtils } from './index';

describe('StringUtils', () => {
  describe('isBlank', () => {
    test('should return true when string is an empty string', () => {
      // Given
      const str = '';

      // When
      const isBlank = StringUtils.isBlank(str);

      // Then
      expect(isBlank).toBeTruthy();
    });

    test('should return true when string is null', () => {
      // Given
      const str = null;

      // When
      const isBlank = StringUtils.isBlank(str);

      // Then
      expect(isBlank).toBeTruthy();
    });

    test('should return true when string is undefined', () => {
      // Given
      const str = undefined;

      // When
      const isBlank = StringUtils.isBlank(str);

      // Then
      expect(isBlank).toBeTruthy();
    });

    test('should return false when string is non empty string', () => {
      // Given
      const str = 'Hello, world!';

      // When
      const isBlank = StringUtils.isBlank(str);

      // Then
      expect(isBlank).toBeFalsy();
    });
  });

  describe('isNotBlank', () => {
    test('should return false when string is an empty string', () => {
      // Given
      const str = '';

      // When
      const isBlank = StringUtils.isNotBlank(str);

      // Then
      expect(isBlank).toBeFalsy();
    });

    test('should return false when string is null', () => {
      // Given
      const str = null;

      // When
      const isBlank = StringUtils.isNotBlank(str);

      // Then
      expect(isBlank).toBeFalsy();
    });

    test('should return false when string is undefined', () => {
      // Given
      const str = undefined;

      // When
      const isBlank = StringUtils.isNotBlank(str);

      // Then
      expect(isBlank).toBeFalsy();
    });

    test('should return true when string is non empty string', () => {
      // Given
      const str = 'Hello, world!';

      // When
      const isBlank = StringUtils.isNotBlank(str);

      // Then
      expect(isBlank).toBeTruthy();
    });
  });
});
