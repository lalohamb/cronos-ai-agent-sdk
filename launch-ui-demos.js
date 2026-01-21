#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const wikidir = 'docs/wiki';
const readline = require('readline');

console.log('🚀 Cronos AI Agent SDK - UI Demo Launcher');
console.log('==========================================\n');

const demos = [
  {
    name: 'UI Demo (Policy Pack System)',
    path: 'packages/examples/ui-demo',
    port: '5173',
    description: 'Main UI demo with Policy Pack system and real SDK integration'
  },
  {
    name: 'Bolt Demo (Marketing)',
    path: 'packages/exampleboltdemo', 
    port: '5174',
    description: 'Marketing/sales demo with mock SDK simulation'
  },
  {
    name: 'DeFi Dashboard (Commercial)',
    path: 'packages/examples02/defi-dashboard',
    port: '3001', 
    description: 'Commercial demo with DeFi-focused features'
  },
  {
    name: 'UI Package Dev Server',
    path: 'packages/ui',
    port: '6006',
    description: 'UI component library development server (Storybook/dev mode)'
  }
];

console.log('📋 Available UI Demos:');
console.log('======================');
demos.forEach((demo, index) => {
  console.log(`${index + 1}. ${demo.name}`);
  console.log(`   📁 Path: ${demo.path}`);
  console.log('   📁wikidir: ' + demo.wikidir);
  console.log(`   🌐 Port: http://localhost:${demo.port}`);
  console.log(`   📝 ${demo.description}\n`);
});

console.log('🎯 Launch Options:');
console.log('==================');
console.log('• Enter demo number (1-4) to launch specific demo');
console.log('• Enter "all" to launch all demos simultaneously');
console.log('• Enter "ports" to see port usage summary');
console.log('• Enter "quit" to exit\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const runningProcesses = [];

function launchDemo(demo) {
  console.log(`🚀 Launching ${demo.name}...`);
  console.log(`📁 Directory: ${demo.path}`);
  console.log(`🌐 URL: http://localhost:${demo.port}\n`);
  
  const process = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, demo.path),
    stdio: 'inherit',
    shell: true
  });
  
  runningProcesses.push({
    process,
    name: demo.name,
    port: demo.port
  });
  
  process.on('error', (error) => {
    console.error(`❌ Failed to launch ${demo.name}:`, error.message);
  });
}

function showPortSummary() {
  console.log('\n🌐 Port Usage Summary:');
  console.log('=====================');
  demos.forEach(demo => {
    console.log(`• Port ${demo.port}: ${demo.name}`);
  });
  console.log('\n💡 Note: If ports conflict, demos will auto-increment (e.g., 5173 → 5174)\n');
}

function handleExit() {
  if (runningProcesses.length > 0) {
    console.log('\n🛑 Stopping running demos...');
    runningProcesses.forEach(({ process, name }) => {
      console.log(`   Stopping ${name}...`);
      process.kill('SIGTERM');
    });
  }
  console.log('👋 Goodbye!');
  process.exit(0);
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

rl.question('Enter your choice: ', (answer) => {
  const choice = answer.trim().toLowerCase();
  
  if (choice === 'quit' || choice === 'q') {
    rl.close();
    return;
  }
  
  if (choice === 'ports') {
    showPortSummary();
    rl.close();
    return;
  }
  
  if (choice === 'all') {
    console.log('🚀 Launching all UI demos...\n');
    demos.forEach(demo => launchDemo(demo));
    console.log('✅ All demos launched! Press Ctrl+C to stop all demos.\n');
    console.log('🌐 Open these URLs in your browser:');
    demos.forEach(demo => {
      console.log(`   • ${demo.name}: http://localhost:${demo.port}`);
    });
    return;
  }
  
  const demoIndex = parseInt(choice) - 1;
  if (demoIndex >= 0 && demoIndex < demos.length) {
    launchDemo(demos[demoIndex]);
    console.log('✅ Demo launched! Press Ctrl+C to stop.\n');
  } else {
    console.log('❌ Invalid choice. Please enter 1-4, "all", "ports", or "quit"');
    rl.close();
  }
});

rl.on('close', () => {
  if (runningProcesses.length === 0) {
    process.exit(0);
  }
});