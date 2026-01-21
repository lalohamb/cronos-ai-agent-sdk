import { stableStringify } from './stableStringify';

/**
 * Hash an object using a fast, deterministic hash function
 * Works in both Node.js and browser environments
 *
 * Note: This uses a non-cryptographic hash for browser compatibility.
 * For cryptographic hashing in Node.js, use the crypto module directly.
 */
export function hashObject(obj: any): string {
  const normalized = stableStringify(obj);
  return fastHash(normalized);
}

/**
 * Fast non-cryptographic hash function (FNV-1a variant)
 * Produces consistent 64-character hex strings
 */
function fastHash(str: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ char, 2654435761);
    h2 = Math.imul(h2 ^ char, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hash1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hash2 = (h2 >>> 0).toString(16).padStart(8, '0');

  // Repeat to create a 64-character hash (similar to SHA-256 output length)
  return (hash1 + hash2 + hash1 + hash2 + hash1 + hash2 + hash1 + hash2);
}