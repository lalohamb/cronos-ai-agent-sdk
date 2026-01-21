#!/bin/bash

echo "🚀 Starting All UI Demos..."
echo ""

# Kill any existing processes on these ports
lsof -ti:5173,5174,5175,3001 | xargs kill -9 2>/dev/null || true

# Start UI Demo (port 5173)
echo "📱 Starting UI Demo on http://localhost:5173"
cd packages/examples/ui-demo
npm run dev > /tmp/ui-demo.log 2>&1 &
UI_DEMO_PID=$!
cd ../../..

# Start Bolt Demo (port 5174)
echo "📱 Starting Bolt Demo on http://localhost:5174"
cd packages/exampleboltdemo
npm run dev -- --port 5174 > /tmp/bolt-demo.log 2>&1 &
BOLT_DEMO_PID=$!
cd ../..

# Start Building UI (port 5175)
echo "📱 Starting Building UI on http://localhost:5175"
cd packages/examplebuildingui
npm run dev -- --port 5175 > /tmp/building-ui.log 2>&1 &
BUILDING_UI_PID=$!
cd ../..

# Start DeFi Dashboard (port 3001)
echo "📱 Starting DeFi Dashboard on http://localhost:3001"
cd packages/examples02/defi-dashboard
npm run dev -- --port 3001 > /tmp/defi-dashboard.log 2>&1 &
DEFI_DASH_PID=$!
cd ../../..

echo ""
echo "⏳ Waiting for servers to start..."
sleep 5

echo ""
echo "✅ All UIs Started!"
echo ""
echo "📋 Access URLs:"
echo "   1. UI Demo:          http://localhost:5173"
echo "   2. Bolt Demo:        http://localhost:5174"
echo "   3. Building UI:      http://localhost:5175"
echo "   4. DeFi Dashboard:   http://localhost:3001"
echo ""
echo "📊 Process IDs:"
echo "   UI Demo:       $UI_DEMO_PID"
echo "   Bolt Demo:     $BOLT_DEMO_PID"
echo "   Building UI:   $BUILDING_UI_PID"
echo "   DeFi Dashboard: $DEFI_DASH_PID"
echo ""
echo "📝 Logs:"
echo "   tail -f /tmp/ui-demo.log"
echo "   tail -f /tmp/bolt-demo.log"
echo "   tail -f /tmp/building-ui.log"
echo "   tail -f /tmp/defi-dashboard.log"
echo ""
echo "🛑 To stop all: kill $UI_DEMO_PID $BOLT_DEMO_PID $BUILDING_UI_PID $DEFI_DASH_PID"
echo ""
