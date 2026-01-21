import OpenAI from 'openai';
import { AgentContext, AgentDecision } from '../agents/types';
import { AIProvider, AIProviderConfig } from './types';

export class OpenAIProvider implements AIProvider {
  private client?: OpenAI;
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
    if (config.apiKey) {
      this.client = new OpenAI({ apiKey: config.apiKey });
    }
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async generateDecision(prompt: string, context: AgentContext): Promise<AgentDecision> {
    if (!this.client) {
      throw new Error('OpenAI client not configured');
    }

    const systemPrompt = `You are an AI agent for blockchain smart contract automation. 
    Analyze the given context and provide a decision in JSON format with:
    - action: {type: string, value?: string, reason?: string, severity?: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'}
    - reason: string
    - confidence: number (0-1)`;

    const userPrompt = `${prompt}\n\nContext: ${JSON.stringify(context, null, 2)}`;

    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: this.config.temperature || 0.3,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content) as AgentDecision;
    } catch (error) {
      // Fallback decision if AI fails
      return {
        action: { type: 'HOLD', reason: 'AI analysis failed' },
        reason: `AI provider error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        confidence: 0.1
      };
    }
  }
}