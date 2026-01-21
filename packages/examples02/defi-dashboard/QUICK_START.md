# 🚀 Quick Start - Cronos AI Agent SDK Sales Demo

## Installation & Launch (2 minutes)

```bash
# Navigate to the demo
cd packages/examples02/defi-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser to **http://localhost:3001**

## What You'll See

### 1. Sales Landing Page (Default View)
- Hero section with value proposition
- Feature highlights
- Built-in agents showcase
- **Pricing tiers**:
  - Starter: $199-499/month
  - Growth: $1,500-3,000/month
  - Enterprise: Custom
- Call-to-action buttons:
  - **"View Live Demo"** → Opens the dashboard
  - **"Schedule Demo Call"** → Sales conversation
  - **"Read Documentation"** → Opens comprehensive wiki in new tab

**Click "View Live Demo"** to enter the dashboard

### 2. Navigation Tabs
Once in the dashboard, you'll see three tabs:

#### 📊 DeFi Demo
- Real-time portfolio performance chart
- Risk monitor with circular progress indicator
- Live agent activity feed
- Simulated real-time updates

#### 💰 AaaS Dashboard
- Monthly Recurring Revenue: $47,500
- Active Customers: 23
- Transaction Fees: $8,420/month
- Agent Executions: 156K+
- Revenue breakdown chart
- Customer tier distribution
- Agent performance metrics
- Live revenue events

#### 🏪 Merchant Copilot
- Payment volume analytics
- Success rate monitoring (97.8%)
- AI-powered insights with ROI calculations
- Failed payment analysis
- Liquidity forecasting
- Fraud detection alerts

### 3. Back to Sales
Click **"Back to Sales"** button to return to the landing page

## Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Key Features to Demonstrate

### For Technical Audiences
1. Show the **DeFi Demo** tab
2. Highlight real-time agent decisions
3. Point out the risk monitoring
4. Explain the agent activity feed

### For Business Audiences
1. Start with the **Sales Landing Page**
2. Show the **AaaS Dashboard** for revenue metrics
3. Demonstrate the **Merchant Copilot** for merchant value
4. Emphasize the pricing tiers and ROI

### For Partners
1. Show the **AaaS Dashboard** revenue model
2. Discuss white-label opportunities
3. Highlight the merchant copilot as a separate product
4. Talk about revenue sharing

## Customization

### Update Pricing
Edit `src/components/SalesLanding.tsx` around line 180-250

### Modify Metrics
Edit the initial state values in:
- `src/components/CommercialDashboard.tsx` (lines 8-11)
- `src/components/MerchantCopilot.tsx` (lines 10-12)

### Change Branding
Update colors in the gradient classes:
- `from-purple-500 to-pink-500` → your brand colors
- `bg-slate-900` → your background color

## Troubleshooting

### Port Already in Use
If port 3001 is busy, Vite will automatically use the next available port.

### Build Warnings
The "chunk size" warning is expected due to Recharts and Framer Motion. This is fine for a demo.

### Missing Dependencies
If you see import errors, run:
```bash
npm install
```

## Next Steps

1. **Read the guides**:
   - [SALES_DEMO_GUIDE.md](./SALES_DEMO_GUIDE.md) - Full demo script
   - [COMMERCIALIZATION_SUMMARY.md](./COMMERCIALIZATION_SUMMARY.md) - Revenue strategy

2. **Customize for your needs**:
   - Update pricing to match your market
   - Add your own metrics and data
   - Customize branding and colors

3. **Deploy**:
   - Build with `npm run build`
   - Deploy `dist/` folder to Vercel, Netlify, or any static host

## Support

For questions or issues:
- Check the main [README.md](./README.md)
- Review the [SALES_DEMO_GUIDE.md](./SALES_DEMO_GUIDE.md)
- Examine the source code in `src/components/`

---

**Ready to generate revenue?** Start the demo and begin your sales conversations! 🚀

