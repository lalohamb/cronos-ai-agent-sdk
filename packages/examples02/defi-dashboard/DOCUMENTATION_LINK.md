# Documentation Link Setup

## What Was Added

The "Read Documentation" button in the sales landing page now links to the comprehensive wiki documentation.

## Changes Made

### 1. Updated SalesLanding Component
- Added `onClick` handler to "Read Documentation" button
- Opens `/docs/wiki/index.html` in a new tab
- Located at line 313 in `src/components/SalesLanding.tsx`

### 2. Copied Wiki Documentation
- Copied from `packages/examples/ui-demo/public/docs/`
- Placed in `packages/examples02/defi-dashboard/public/docs/`
- Includes complete SDK documentation with:
  - Getting Started guide
  - API Reference
  - Built-in Agents documentation
  - Policy Engine guide
  - UI Components reference
  - Examples and tutorials

## How It Works

When users click "Read Documentation" on the sales landing page:
1. Opens a new browser tab
2. Loads the comprehensive wiki at `/docs/wiki/index.html`
3. Users can explore full SDK documentation

## Documentation Contents

The wiki includes:
- **Overview**: SDK introduction and features
- **Quick Start**: Installation and basic usage
- **Core Concepts**: Agents, policies, contracts
- **Built-in Agents**: RiskMonitor, LiquidityOptimizer, EmergencyBrake, ThresholdGuard, AnomalyDetector
- **Policy Engine**: Safety policies and enforcement
- **UI Components**: React component library
- **API Reference**: Complete SDK API
- **Examples**: Code samples and tutorials

## Testing

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3003 (or the port shown)

3. Click "Read Documentation" button

4. Verify the wiki opens in a new tab

## Production Build

The documentation is included in the production build:
```bash
npm run build
```

The `public/docs/` folder is automatically copied to `dist/docs/` during build.

## Customization

To update the documentation:
1. Edit files in `public/docs/wiki/`
2. The wiki uses a single HTML file with embedded styles
3. Rebuild to see changes in production

## Benefits

- **Seamless Experience**: Users can explore docs without leaving the demo
- **Complete Information**: Full SDK documentation available
- **Professional**: Shows the product is well-documented
- **Conversion**: Helps technical users evaluate the SDK

