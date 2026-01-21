import { PolicyPackVerifier } from './verifier';
import { PolicyPack } from './types';

export class NoopPolicyPackVerifier implements PolicyPackVerifier {
  async verify(pack: PolicyPack): Promise<{ ok: boolean; reason?: string }> {
    return { ok: true };
  }
}