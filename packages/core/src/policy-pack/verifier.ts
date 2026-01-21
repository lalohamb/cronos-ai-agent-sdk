import { PolicyPack } from './types';

export interface PolicyPackVerifier {
  verify(pack: PolicyPack): Promise<{ ok: boolean; reason?: string }>;
}