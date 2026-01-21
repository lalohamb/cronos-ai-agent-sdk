# Monorepo Environment Guide

## What is This?

This is a **monorepo** - a single repository containing multiple related packages managed together using npm workspaces.

## Structure

```
cronos-ai-agent-sdk/
├── package.json              # Root workspace configuration
└── packages/
    ├── core/                 # @sentinel/ai-agent-sdk (main SDK)
    ├── ui/                   # @cronos/ai-agent-ui (React components)
    ├── examples/             # Usage examples
    └── examples02/           # Commercial demos
```

## Key Commands

### Install Package
```bash
npm install @sentinel/ai-agent-sdk
```
Downloads and installs the SDK from npm registry into your `node_modules/` folder.

### Build All Packages
```bash
npm run build --workspaces
```
Runs the `build` script in **every** workspace package that has one:
- Compiles TypeScript → JavaScript
- Generates `dist/` folders
- Executes in: `packages/core`, `packages/ui`, etc.

**Without `--workspaces`**: Only runs root build script (doesn't exist)  
**With `--workspaces`**: Automatically runs build in all packages

### Test All Packages
```bash
npm run test --workspaces
```
Runs tests across all workspace packages.

### Clean Build Artifacts
```bash
npm run clean
```
Removes all `dist/` folders from packages.

## Where is @sentinel/ai-agent-sdk?

The package lives in `packages/core/`. The `package.json` inside defines it as `@sentinel/ai-agent-sdk`.

## Why Workspaces?

**Single command** instead of:
```bash
cd packages/core && npm run build
cd ../ui && npm run build
cd ../examples/ui-demo && npm run build
# ... repeat for each package
```

**Just run**:
```bash
npm run build --workspaces
```

All packages build automatically.
