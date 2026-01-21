#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 COMPREHENSIVE TEST SUITE - Cronos AI Agent SDK v5.2.0');
console.log('Testing: Core SDK + Policy Pack System + UI Components\n');

const runCommand = (cmd, cwd, description) => {
  console.log(`📋 ${description}...`);
  try {
    execSync(cmd, { cwd, stdio: 'inherit' });
    console.log(`✅ ${description} - PASSED\n`);
    return true;
  } catch (error) {
    console.log(`❌ ${description} - FAILED\n`);
    return false;
  }
};

const results = [];

// Test 1: Core SDK Tests
results.push(runCommand(
  'npm test',
  path.join(__dirname, 'packages/core'),
  'Core SDK Tests (60 tests including Policy Pack)'
));

// Test 2: Core SDK Build
results.push(runCommand(
  'npm run build',
  path.join(__dirname, 'packages/core'),
  'Core SDK TypeScript Build'
));

// Test 3: UI Package Build
results.push(runCommand(
  'npm run build',
  path.join(__dirname, 'packages/ui'),
  'UI Package TypeScript Build'
));

// Test 4: UI Demo Type Check
results.push(runCommand(
  'npx tsc --noEmit',
  path.join(__dirname, 'packages/examples/ui-demo'),
  'UI Demo Type Checking'
));

// Test 5: Standalone Example Test (install deps first)
const standaloneTestPath = path.join(__dirname, 'packages/examples/standalone-test');
runCommand('npm install', standaloneTestPath, 'Standalone Test Dependencies');
results.push(runCommand(
  'npm test',
  standaloneTestPath,
  'Standalone Integration Test'
));

// Test 6: Policy Pack Integration Test
results.push(runCommand(
  'npm test -- --testNamePattern="PolicyPack"',
  path.join(__dirname, 'packages/core'),
  'Policy Pack System Tests'
));

// Test 7: UI Demo Dependencies
results.push(runCommand(
  'npm install',
  path.join(__dirname, 'packages/examples/ui-demo'),
  'UI Demo Dependencies Installation'
));

console.log('📊 TEST RESULTS SUMMARY');
console.log('========================');

const passed = results.filter(r => r).length;
const total = results.length;

console.log(`✅ Passed: ${passed}/${total}`);
console.log(`❌ Failed: ${total - passed}/${total}`);

if (passed === total) {
  console.log('\n🎉 ALL TESTS PASSED! 🎉');
  console.log('\n📋 VERIFIED COMPONENTS:');
  console.log('  ✓ Policy Pack Types & Interfaces');
  console.log('  ✓ Policy Pack Verifiers (Noop & Mock)');
  console.log('  ✓ PolicyEngine with Policy Pack Integration');
  console.log('  ✓ ControlPlaneClient Updates');
  console.log('  ✓ SentinelAgentSDK Policy Pack Loading');
  console.log('  ✓ Policy Pack Enforcement (10 test scenarios)');
  console.log('  ✓ SDK Integration Tests (4 scenarios)');
  console.log('  ✓ UI PolicyManager Component');
  console.log('  ✓ UI Demo with Enhanced Test Data');
  console.log('  ✓ TypeScript Compilation (Core + UI)');
  console.log('  ✓ Backward Compatibility (All existing tests pass)');
  
  console.log('\n🚀 READY FOR DEMO:');
  console.log('  cd packages/examples/ui-demo');
  console.log('  npm run dev');
  console.log('  Open http://localhost:5173');
} else {
  console.log('\n❌ SOME TESTS FAILED');
  console.log('Please check the output above for details.');
  process.exit(1);
}