import { AgentDecision, AgentContext } from '../agents/types';
import { Policy } from './types';
import { PolicyPack, PolicyRuleset } from '../policy-pack/types';

export class PolicyEngine {
  private policies: Map<string, Policy> = new Map();
  private policyPack?: PolicyPack;

  addPolicy(policy: Policy): void {
    this.policies.set(policy.id, policy);
  }

  removePolicy(id: string): boolean {
    return this.policies.delete(id);
  }

  hasPolicy(id: string): boolean {
    return this.policies.has(id);
  }

  listPolicies(): string[] {
    return Array.from(this.policies.keys());
  }

  validate(decision: AgentDecision): boolean {
    for (const policy of this.policies.values()) {
      if (!policy.validate(decision)) {
        return false;
      }
    }
    return true;
  }

  enforce(decision: AgentDecision, context?: AgentContext): AgentDecision {
    let enforcedDecision = { ...decision };
    
    // Apply existing policies first (backward compatibility)
    for (const policy of this.policies.values()) {
      if (policy.enforce) {
        enforcedDecision = policy.enforce(enforcedDecision);
      }
    }
    
    // Apply policy pack rules if available
    if (this.policyPack && context) {
      enforcedDecision = this.applyPolicyPackRules(enforcedDecision, context);
    }
    
    return enforcedDecision;
  }

  clear(): void {
    this.policies.clear();
  }

  setPolicyPack(pack: PolicyPack): void {
    this.policyPack = pack;
  }

  getPolicyPack(): PolicyPack | undefined {
    return this.policyPack;
  }

  private applyPolicyPackRules(decision: AgentDecision, context: AgentContext): AgentDecision {
    if (!this.policyPack) return decision;

    // Get applicable rulesets
    const applicableRulesets = this.getApplicableRulesets(context);
    
    // Sort by priority descending
    applicableRulesets.sort((a, b) => b.priority - a.priority);

    let enforcedDecision = { ...decision };

    for (const ruleset of applicableRulesets) {
      if (!ruleset.enabled) continue;

      for (const rule of ruleset.rules) {
        enforcedDecision = this.applyRule(enforcedDecision, rule, context);
      }
    }

    return enforcedDecision;
  }

  private getApplicableRulesets(context: AgentContext): PolicyRuleset[] {
    if (!this.policyPack) return [];

    return this.policyPack.rulesets.filter(ruleset => {
      if (ruleset.scope === 'global') return true;
      if (ruleset.scope === 'agent' && ruleset.agentId === context.customData?.agentId) return true;
      if (ruleset.scope === 'contract' && ruleset.contractId === context.contractId) return true;
      return false;
    });
  }

  private applyRule(decision: AgentDecision, rule: PolicyRuleset['rules'][0], context: AgentContext): AgentDecision {
    const result = { ...decision };

    switch (rule.type) {
      case 'clamp':
        const value = this.getFieldValue(result, rule.field);
        if (typeof value === 'number') {
          let clampedValue = value;
          if (rule.min !== undefined && clampedValue < rule.min) clampedValue = rule.min;
          if (rule.max !== undefined && clampedValue > rule.max) clampedValue = rule.max;
          this.setFieldValue(result, rule.field, clampedValue);
        }
        break;

      case 'denyIf':
        const fieldValue = this.getFieldValue(result, rule.field);
        if (this.evaluateCondition(fieldValue, rule.op, rule.value)) {
          throw new Error(`Policy violation: ${rule.field} ${rule.op} ${rule.value}`);
        }
        break;

      case 'requireTag':
        const tags = result.metadata?.tags || [];
        if (!Array.isArray(tags) || !tags.includes(rule.tag)) {
          throw new Error(`Policy violation: Required tag '${rule.tag}' missing`);
        }
        break;
    }

    return result;
  }

  private getFieldValue(obj: any, field: string): any {
    const parts = field.split('.');
    let current = obj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  }

  private setFieldValue(obj: any, field: string, value: any): void {
    const parts = field.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
  }

  private evaluateCondition(left: any, op: string, right: any): boolean {
    switch (op) {
      case '>': return left > right;
      case '>=': return left >= right;
      case '<': return left < right;
      case '<=': return left <= right;
      case '==': return left == right;
      case '!=': return left != right;
      default: return false;
    }
  }
}