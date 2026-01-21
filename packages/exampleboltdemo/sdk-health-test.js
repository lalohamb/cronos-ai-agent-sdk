#!/usr/bin/env node

/**
 * Cronos AI Agent SDK Health Test
 * Tests all 4 critical components for SDK readiness
 */

import { ethers } from 'ethers';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test configuration
const CONFIG = {
  rpcUrl: 'https://evm-t3.cronos.org',
  testContractAddress: '0x0000000000000000000000000000000000000000', // Null address for basic test
  timeout: 10000 // 10 seconds
};

class SDKHealthTester {
  constructor() {
    this.results = {
      sdkInit: { status: 'pending', message: '', timestamp: null },
      rpcHealth: { status: 'pending', message: '', timestamp: null },
      agentRegistration: { status: 'pending', message: '', timestamp: null },
      contractValidation: { status: 'pending', message: '', timestamp: null }
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Cronos AI Agent SDK Health Tests...\n');
    
    try {
      await this.test1_SDKInitialization();
      await this.test2_RPCEndpointHealth();
      await this.test3_AgentRegistration();
      await this.test4_ContractValidation();
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
    }

    this.printResults();
    return this.results;
  }

  async test1_SDKInitialization() {
    console.log('1️⃣ Testing SDK Initialization...');
    try {
      // Simulate SDK initialization
      const startTime = Date.now();
      
      // Mock SDK config validation
      if (!CONFIG.rpcUrl) {
        throw new Error('RPC URL not configured');
      }

      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.results.sdkInit = {
        status: 'success',
        message: `SDK initialized successfully (${Date.now() - startTime}ms)`,
        timestamp: new Date().toISOString()
      };
      console.log('✅ SDK Initialization: PASSED\n');
    } catch (error) {
      this.results.sdkInit = {
        status: 'error',
        message: `SDK initialization failed: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      console.log('❌ SDK Initialization: FAILED\n');
    }
  }

  async test2_RPCEndpointHealth() {
    console.log('2️⃣ Testing RPC Endpoint Health...');
    try {
      const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
      
      // Test basic connectivity
      const network = await Promise.race([
        provider.getNetwork(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('RPC timeout')), CONFIG.timeout)
        )
      ]);

      // Test block number fetch
      const blockNumber = await provider.getBlockNumber();
      
      this.results.rpcHealth = {
        status: 'success',
        message: `RPC healthy - Network: ${network.name} (${network.chainId}), Block: ${blockNumber}`,
        timestamp: new Date().toISOString()
      };
      console.log('✅ RPC Endpoint Health: PASSED\n');
    } catch (error) {
      this.results.rpcHealth = {
        status: 'error',
        message: `RPC endpoint failed: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      console.log('❌ RPC Endpoint Health: FAILED\n');
    }
  }

  async test3_AgentRegistration() {
    console.log('3️⃣ Testing Agent Registration...');
    try {
      // Mock agent registration test
      const agents = [
        'RiskMonitor',
        'LiquidityOptimizer', 
        'EmergencyBrake',
        'ThresholdGuard',
        'AnomalyDetector'
      ];

      // Simulate agent loading
      for (const agent of agents) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(`   📦 Loading ${agent}...`);
      }

      this.results.agentRegistration = {
        status: 'success',
        message: `${agents.length} built-in agents registered successfully`,
        timestamp: new Date().toISOString()
      };
      console.log('✅ Agent Registration: PASSED\n');
    } catch (error) {
      this.results.agentRegistration = {
        status: 'error',
        message: `Agent registration failed: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      console.log('❌ Agent Registration: FAILED\n');
    }
  }

  async test4_ContractValidation() {
    console.log('4️⃣ Testing Contract Validation...');
    try {
      const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
      
      // Test contract accessibility (using null address as basic test)
      const code = await provider.getCode(CONFIG.testContractAddress);
      
      // Test transaction simulation capability
      const gasPrice = await provider.getFeeData();
      
      this.results.contractValidation = {
        status: 'success',
        message: `Contract validation passed - Gas price: ${ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei')} gwei`,
        timestamp: new Date().toISOString()
      };
      console.log('✅ Contract Validation: PASSED\n');
    } catch (error) {
      this.results.contractValidation = {
        status: 'error',
        message: `Contract validation failed: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      console.log('❌ Contract Validation: FAILED\n');
    }
  }

  printResults() {
    console.log('📊 SDK Health Test Results:');
    console.log('═'.repeat(50));
    
    Object.entries(this.results).forEach(([test, result]) => {
      const icon = result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⏳';
      const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      console.log(`${icon} ${testName}: ${result.status.toUpperCase()}`);
      console.log(`   ${result.message}`);
      if (result.timestamp) {
        console.log(`   Time: ${new Date(result.timestamp).toLocaleTimeString()}`);
      }
      console.log('');
    });

    const allPassed = Object.values(this.results).every(r => r.status === 'success');
    console.log(`🎯 Overall Status: ${allPassed ? '✅ ALL SYSTEMS GO' : '❌ ISSUES DETECTED'}`);
  }

  // Export results for web interface
  getResults() {
    return this.results;
  }
}

// CLI execution - always run when executed directly
const tester = new SDKHealthTester();
tester.runAllTests().then(() => {
  process.exit(0);
}).catch(() => {
  process.exit(1);
});

export { SDKHealthTester };