import { PolicyPackVerifier } from './verifier';
import { PolicyPack } from './types';

export class MockPolicyPackVerifier implements PolicyPackVerifier {
  constructor(private options: { expectedSignature?: string } = {}) {}

  async verify(pack: PolicyPack): Promise<{ ok: boolean; reason?: string }> {
    if (this.options.expectedSignature && pack.signature !== this.options.expectedSignature) {
      return { ok: false, reason: 'Signature mismatch' };
    }
    return { ok: true };
  }
}