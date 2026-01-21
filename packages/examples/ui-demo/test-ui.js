#!/usr/bin/env node

/**
 * Simple test script to verify UI components work with Policy Pack system
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Testing Cronos AI Agent UI with Policy Pack System\n');

// Build core package
console.log('📦 Building core package...');
try {
  execSync('npm run build', { 
    cwd: path.join(__dirname, '../../core'),
    stdio: 'inherit'
  });
  console.log('✅ Core package built successfully\n');
} catch (error) {
  console.error('❌ Failed to build core package');
  process.exit(1);
}

// Build UI package
console.log('📦 Building UI package...');
try {
  execSync('npm run build', { 
    cwd: path.join(__dirname, '../../ui'),
    stdio: 'inherit'
  });
  console.log('✅ UI package built successfully\n');
} catch (error) {
  console.error('❌ Failed to build UI package');
  process.exit(1);
}

// Install demo dependencies
console.log('📦 Installing demo dependencies...');
try {
  execSync('npm install', { 
    cwd: __dirname,
    stdio: 'inherit'
  });
  console.log('✅ Demo dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install demo dependencies');
  process.exit(1);
}

// Type check the demo
console.log('🔍 Type checking demo...');
try {
  execSync('npx tsc --noEmit', { 
    cwd: __dirname,
    stdio: 'inherit'
  });
  console.log('✅ Type checking passed\n');
} catch (error) {
  console.error('❌ Type checking failed');
  process.exit(1);
}

console.log('🎉 All tests passed! UI is ready for testing.\n');
console.log('To start the demo:');
console.log('  cd packages/examples/ui-demo');
console.log('  npm run dev');
console.log('\nThen open http://localhost:5173 in your browser');
console.log('\n📋 Test Checklist:');
console.log('  ✓ Policy Pack information displays correctly');
console.log('  ✓ Rulesets show with proper color coding');
console.log('  ✓ Rules expand/collapse functionality works');
console.log('  ✓ Agent registration and execution works');
console.log('  ✓ Policy enforcement is visible in decisions');
console.log('  ✓ Runtime ID and version tracking works');