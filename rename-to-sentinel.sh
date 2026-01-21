#!/bin/bash

echo "🔄 Renaming Cronos AI Agent SDK to Sentinel AI Agent SDK..."

# 1. Update package.json files - change package name references
echo "📦 Updating package.json files..."
find . -name "package.json" -not -path "*/node_modules/*" -not -path "*/dist/*" -exec sed -i 's/"@cronos\/ai-agent-sdk"/"@sentinel\/ai-agent-sdk"/g' {} \;

# 2. Update all TypeScript/JavaScript imports
echo "📝 Updating import statements..."
find . \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" \
  -not -path "*/coverage/*" \
  -exec sed -i "s/from '@cronos\/ai-agent-sdk'/from '@sentinel\/ai-agent-sdk'/g" {} \;

# 3. Update class name CronosAgentSDK to SentinelAgentSDK
echo "🔧 Updating class names..."
find . \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" \
  -not -path "*/coverage/*" \
  -exec sed -i 's/CronosAgentSDK/SentinelAgentSDK/g' {} \;

# 4. Update markdown documentation
echo "📚 Updating documentation..."
find . -name "*.md" \
  -not -path "*/node_modules/*" \
  -exec sed -i "s/@cronos\/ai-agent-sdk/@sentinel\/ai-agent-sdk/g" {} \;

find . -name "*.md" \
  -not -path "*/node_modules/*" \
  -exec sed -i 's/CronosAgentSDK/SentinelAgentSDK/g' {} \;

# 5. Rename the main SDK file
echo "📄 Renaming main SDK file..."
if [ -f "packages/core/src/CronosAgentSDK.ts" ]; then
  mv packages/core/src/CronosAgentSDK.ts packages/core/src/SentinelAgentSDK.ts
  echo "✅ Renamed CronosAgentSDK.ts to SentinelAgentSDK.ts"
fi

# 6. Update test files
if [ -f "packages/core/src/__tests__/CronosAgentSDK.test.ts" ]; then
  mv packages/core/src/__tests__/CronosAgentSDK.test.ts packages/core/src/__tests__/SentinelAgentSDK.test.ts
  echo "✅ Renamed test file"
fi

# 7. Clean up package-lock.json files (they'll be regenerated)
echo "🧹 Cleaning package-lock.json files..."
find . -name "package-lock.json" -not -path "*/node_modules/*" -delete

echo ""
echo "✅ Renaming complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run build --workspaces"
echo "3. Test your changes"
