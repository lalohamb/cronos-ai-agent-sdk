export type PolicyPack = {
  packVersion: string;               // e.g. "2025.12.17.1"
  issuedAt: number;                  // ms epoch
  issuer?: string;                   // e.g. "cronos-agent-control-plane"
  signature?: string;                // optional (base64)
  publicKeyId?: string;              // optional key reference

  // A pack contains multiple rulesets. Each ruleset can target an agent, contract, or global.
  rulesets: PolicyRuleset[];
};

export type PolicyRuleset = {
  id: string;                        // unique ruleset id
  scope: "global" | "agent" | "contract";
  agentId?: string;                  // required if scope="agent"
  contractId?: string;               // required if scope="contract"
  priority: number;                  // higher wins
  enabled: boolean;

  // Rules should be simple and declarative (no eval).
  // Keep minimal set to start; you can expand later.
  rules: Array<
    | { type: "clamp"; field: string; min?: number; max?: number }
    | { type: "denyIf"; field: string; op: ">" | ">=" | "<" | "<=" | "==" | "!="; value: number | string | boolean }
    | { type: "requireTag"; tag: string }   // e.g. require decision.metadata.tags includes tag
  >;

  // Optional reason string for audit/logging.
  reason?: string;
};