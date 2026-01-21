# Install Guide - Cronos AI Agent SDK

## Quick Start (Recommended)

```bash
# From project root - installs ALL workspace dependencies
npm install

# Build all packages (REQUIRED before testing)
npm run build --workspaces

# Test all packages
npm run test --workspaces
```

**⚠️ Important**: Always build before testing! UI tests require the core package to be compiled.

## Common Workflows

### Fresh Install & Test
```bash
npm install
npm run build --workspaces
npm run test --workspaces
```

### Clean Rebuild
```bash
npm run clean              # Remove all dist folders
npm run build --workspaces # Rebuild everything
npm run test --workspaces  # Verify all tests pass
```

### Deep Clean & Reinstall
```bash
npm run clean:all  # Remove dist + node_modules
npm install        # Reinstall all dependencies
npm run build --workspaces
npm run test --workspaces
```

## Command Reference by Location

### Root Directory (`/cronos-ai-agent-sdk/`)

| Command | Impact | Output |
|---------|--------|--------|
| `npm install` | Installs ALL workspace dependencies + links packages | `node_modules/` in root + all packages |
| `npm run build --workspaces` | Builds all packages (core, ui, examples) | `packages/*/dist/` + nested dist folders |
| `npm run test --workspaces` | Runs tests in all packages | Test results from all workspaces |
| `npm run clean` | Removes all build artifacts recursively | Deletes all `dist/` folders in packages |
| `npm run clean:all` | Removes all build artifacts + node_modules | Deletes all `dist/` + `node_modules/` folders |

### Core SDK (`/packages/core/`)

| Command | Impact | Output |
|---------|--------|--------|
| `npm install` | Installs core dependencies only | Local `node_modules/` |
| `npm run build` | Compiles TypeScript → JavaScript | `dist/` folder |
| `npm test` | Runs all 72 tests | Test results + coverage |
| `npm run test:x402` | Runs payment/402 tests only | x402 test results |
| `npm run test:coverage` | Runs tests with coverage report | Coverage report |
| `npm run test:payments` | Runs payment system tests | Payment test results |

**Dependencies**: `ethers`, `openai`

### UI Components (`/packages/ui/`)

| Command | Impact | Output |
|---------|--------|--------|
| `npm install` | Installs UI dev dependencies | Local `node_modules/` |
| `npm run build` | Compiles React components | `dist/` folder |
| `npm run dev` | Watches for changes | Continuous build |
| `npm test` | Runs UI component tests (3 suites, 6 tests) | Test results |
| `npm run test:watch` | Runs tests in watch mode | Continuous test results |
| `npm run test:coverage` | Runs tests with coverage report | Coverage report |

**Peer Dependencies**: Requires React 18+ in consuming app
**Note**: UI tests require core package to be built first (`cd packages/core && npm run build`)

### UI Demo (`/packages/examples/ui-demo/`)

| Command | Impact | Output |
|---------|--------|--------|
| `npm install` | Installs React + Vite + local SDK | Local `node_modules/` |
| `npm run dev` | Starts development server | `http://localhost:5173` |
| `npm run build` | Builds for production | `dist/` folder |

**Local Dependencies**: Uses `file:../../core` and `file:../../ui`

### Vault Automation (`/packages/examples/vault-automation/`)

| Command | Impact | Output |
|---------|--------|--------|
| `npm install` | Installs Node.js dependencies | Local `node_modules/` |
| `npm start` | Runs automation example | Console output |

**Runtime**: Uses `ts-node` for direct TypeScript execution

### Standalone Test (`/packages/examples/standalone-test/`)

| Command | Impact | Output |
|---------|--------|--------|
| `npm install` | Installs test dependencies | Local `node_modules/` |
| `npm test` | Tests all built-in agents | Agent test results |

**Purpose**: Isolated testing environment

### DeFi Dashboard (`/packages/examples02/defi-dashboard/`)

| Command | Impact | Output |
|---------|--------|--------|
| `npm install` | Installs React + animations + charts | Local `node_modules/` |
| `npm run dev` | Starts commercial demo | `http://localhost:3001` |
| `npm run build` | Builds production demo | `dist/` folder |

**Dependencies**: `framer-motion`, `recharts`, `lucide-react`

## Build Types & Outputs

### Development Build
```bash
# From root
npm install
npm run build --workspaces
```
**Output**: All `packages/*/dist/` folders with development builds

### Production Build
```bash
# Individual package
cd packages/examples02/defi-dashboard
npm run build
```
**Output**: Optimized `dist/` with minified assets

### Clean Build
```bash
# From root - clean all dist folders recursively
npm run clean
npm run build --workspaces
```
**Output**: Fresh build artifacts

**Important**: The `clean` script now recursively removes ALL `dist/` folders in the packages directory, including nested examples like:
- `packages/core/dist/`
- `packages/ui/dist/`
- `packages/examples/ui-demo/dist/`
- `packages/examples02/defi-dashboard/dist/`

## Testing Commands

### Full Test Suite
```bash
# From root - tests all packages
npm run test --workspaces
```

### Specific Test Types
```bash
# From packages/core/
npm run test:x402        # Payment/402 tests
npm run test:payments    # Payment system tests  
npm run test:coverage    # With coverage report
```

### Example Testing
```bash
# From packages/examples/standalone-test/
npm test                 # Agent functionality tests
```

## Development Servers

### UI Demo
```bash
cd packages/examples/ui-demo
npm run dev              # → http://localhost:5173
```

### Commercial Demo
```bash
cd packages/examples02/defi-dashboard  
npm run dev              # → http://localhost:3001
```

## Workspace Management

### Install for Specific Package
```bash
npm install --workspace=packages/core some-package
```

### Build Specific Package
```bash
npm run build --workspace=packages/core
```

### Why `--workspaces` is Required

**Without `--workspaces`**: Only looks in root package.json
**With `--workspaces`**: Runs command in ALL workspace packages

```bash
# This:
npm run build --workspaces

# Automatically runs:
# cd packages/core && npm run build
# cd packages/ui && npm run build  
# cd packages/examples/ui-demo && npm run build
```

## File Structure Impact

```
cronos-ai-agent-sdk/
├── node_modules/           # Root dependencies
├── packages/
│   ├── core/
│   │   ├── dist/          # Built SDK
│   │   └── node_modules/  # Core dependencies
│   ├── ui/
│   │   ├── dist/          # Built React components
│   │   └── node_modules/  # UI dependencies
│   └── examples/
│       ├── ui-demo/
│       │   ├── dist/      # Built demo app
│       │   └── node_modules/
│       └── vault-automation/
│           └── node_modules/
```

## Common Issues & Solutions

### Missing Dependencies
```bash
# If examples fail to build
cd packages/examples02/defi-dashboard
npm install
```

### Stale Build
```bash
# Clean and rebuild (recommended workflow)
npm run clean
npm run build --workspaces
```

### UI Tests Failing
```bash
# UI tests require core package to be built first
cd packages/core
npm run build
cd ../ui
npm test
```

### Test Failures
```bash
# Run specific test suite
cd packages/core
npm run test:x402
```

### UI Test Module Resolution Errors
If you see errors like `Cannot find module '@sentinel/ai-agent-sdk'` when running UI tests:

```bash
# Solution: Build the core package first
cd packages/core
npm run build

# Then run UI tests
cd ../ui
npm test
```

**Why this happens**: The UI tests use `jest.config.js` with a `moduleNameMapper` that points to the compiled core package (`packages/core/dist/index.js`). If the core package hasn't been built, the tests will fail with module resolution errors.

**Best Practice**: Always run `npm run build --workspaces` before running `npm run test --workspaces` to ensure all packages are built.

## Testing Scripts Reference

### Core SDK Testing (`/packages/core/`)

| Command | Purpose | Output |
|---------|---------|--------|
| `npm test` | Runs all 72 tests | Full test suite results |
| `npm run test:x402` | Tests x402/payment functionality | Payment system test results |
| `npm run test:payments` | Tests payment manager only | Payment manager tests |
| `npm run test:coverage` | Tests with coverage report | Coverage metrics + test results |
| `npm run test:debug` | Verbose test output | Detailed test debugging info |

### Workspace Testing (From Root)

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run test --workspaces` | Tests ALL packages | Results from all workspace packages |

**Packages Tested:**
- `@sentinel/ai-agent-sdk` (17 suites, 72 tests)
- `@cronos/ai-agent-ui` (3 suites, 6 tests)
- `cronos-ai-agent-live-demo` (SDK health test)

### Individual Package Testing

#### UI Components (`/packages/ui/`)
```bash
npm test              # Runs 3 test suites (6 tests)
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

**Test Suites:**
- Dashboard component tests
- AgentConsole component tests
- useAgentSDK hook tests

**Prerequisites**: Core package must be built first
```bash
cd packages/core && npm run build
```

#### Live Demo (`/packages/exampleboltdemo/`)
```bash
npm test                 # Runs SDK health test
npm run test:sdk-health  # Direct health test execution
```

**SDK Health Test Output:**
- ✅ SDK Initialization
- ✅ RPC Endpoint Health  
- ✅ Agent Registration (5 built-in agents)
- ✅ Contract Validation

#### Standalone Test (`/packages/examples/standalone-test/`)
```bash
npm test  # Tests all built-in agents functionality
```

**Agent Tests:**
- RiskMonitor
- LiquidityOptimizer
- EmergencyBrake
- ThresholdGuard
- AnomalyDetector

### Test Results Summary

**✅ All Tests Passing:**
- Core SDK: 17 suites, 72/72 tests ✅
- UI Components: 3 suites, 6/6 tests ✅
- x402 Payment System: All tests ✅
- Agent Functionality: All agents ✅
- SDK Health Check: All systems ✅
- Workspace Integration: All packages ✅

**Total Test Count**: 78 tests across 20 test suites

## Clean Command Reference

### Root Clean Commands
```bash
# Clean build artifacts only (removes ALL dist folders recursively)
npm run clean

# Clean everything including all node_modules folders
npm run clean:all
```

### Manual Deep Clean (Alternative)
```bash
# From project root - removes ALL build artifacts AND node_modules
npm run clean && rm -rf node_modules packages/*/node_modules
```

**Standard Clean (`npm run clean`) removes:**
- `packages/core/dist/` (compiled SDK)
- `packages/ui/dist/` (compiled React components)
- `packages/examples/ui-demo/dist/` (built demo app)
- `packages/examples02/defi-dashboard/dist/` (built dashboard)
- **ALL** other `dist/` folders recursively in workspace packages

**Deep Clean (`npm run clean:all`) removes everything above PLUS:**
- `node_modules/` (root dependencies)
- `packages/*/node_modules/` (all package dependencies)
- `packages/examples/*/node_modules/` (nested example dependencies)
- `packages/examples02/*/node_modules/` (nested demo dependencies)

**What both preserve:**
- Source files
- Configuration files
- Package.json files

**Implementation:**
- **Standard**: `find packages -type d -name 'dist' -exec rm -rf {} + 2>/dev/null || true`
- **Deep**: `npm run clean && find . -name 'node_modules' -type d -prune -exec rm -rf {} +`

**Key Improvement**: The clean script now uses `find` to recursively locate and remove ALL `dist/` folders, not just top-level ones. This ensures nested example projects are properly cleaned.

**After deep clean, reinstall with:**
```bash
npm install
```

This is the correct clean command for removing all TypeScript/Vite build artifacts across the entire monorepo.

## Reference UI_TESTING_GUIDE.md

**SEE UI_TESTING_GUIDE.md**
