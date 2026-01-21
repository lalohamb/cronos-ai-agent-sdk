/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENT_PRIVATE_KEY: string
  readonly VITE_CRONOS_TESTNET_RPC: string
  readonly VITE_NETWORK: string
  readonly VITE_SIMPLE_VAULT_ADDRESS: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_DEMO_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}