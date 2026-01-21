import { hashObject } from '../hash';
import { stableStringify } from '../stableStringify';

describe('Hash utilities', () => {
  describe('stableStringify', () => {
    it('should produce deterministic output for objects', () => {
      const obj1 = { b: 2, a: 1 };
      const obj2 = { a: 1, b: 2 };
      
      expect(stableStringify(obj1)).toBe(stableStringify(obj2));
      expect(stableStringify(obj1)).toBe('{"a":1,"b":2}');
    });

    it('should handle nested objects', () => {
      const obj = { z: { b: 2, a: 1 }, a: 1 };
      expect(stableStringify(obj)).toBe('{"a":1,"z":{"a":1,"b":2}}');
    });

    it('should handle arrays', () => {
      const obj = { arr: [3, 1, 2], key: 'value' };
      expect(stableStringify(obj)).toBe('{"arr":[3,1,2],"key":"value"}');
    });
  });

  describe('hashObject', () => {
    it('should produce consistent hashes for same objects', () => {
      const obj1 = { b: 2, a: 1, timestamp: 1700000000000 };
      const obj2 = { a: 1, b: 2, timestamp: 1700000000000 };
      
      expect(hashObject(obj1)).toBe(hashObject(obj2));
    });

    it('should produce different hashes for different objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };
      
      expect(hashObject(obj1)).not.toBe(hashObject(obj2));
    });

    it('should produce hex string hash', () => {
      const obj = { test: 'value' };
      const hash = hashObject(obj);
      
      expect(typeof hash).toBe('string');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});