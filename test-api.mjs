#!/usr/bin/env node

/**
 * Simple test script for API routes
 * Run with: node test-api.mjs
 */

const BASE_URL = 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

async function testEndpoint(name, url, options = {}) {
  log(colors.cyan, `\n🧪 Testing: ${name}`);
  log(colors.blue, `   URL: ${url}`);

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      log(colors.green, '   ✅ Success!');
      console.log('   Response:', JSON.stringify(data, null, 2).split('\n').slice(0, 10).join('\n   '));
      if (JSON.stringify(data).split('\n').length > 10) {
        console.log('   ...(truncated)');
      }
      return true;
    } else {
      log(colors.yellow, `   ⚠️  Error ${response.status}`);
      console.log('   Response:', JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    log(colors.red, '   ❌ Failed:', error.message);
    return false;
  }
}

async function runTests() {
  log(colors.cyan, '\n═══════════════════════════════════════');
  log(colors.cyan, '   NeurIPS Talent Bridge API Tests');
  log(colors.cyan, '═══════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  // Test 1: GET /api/match (info)
  if (await testEndpoint(
    'Match API Info',
    `${BASE_URL}/api/match`
  )) passed++; else failed++;

  // Test 2: POST /api/match (match paper to job)
  if (await testEndpoint(
    'Match Paper to Job',
    `${BASE_URL}/api/match`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paperId: 'sarah-chen-debate',
        companyId: 'anthropic',
        jobRequirements: 'We are seeking an AI Safety Research Scientist with expertise in alignment, scalable oversight, and debate-based approaches. The ideal candidate will have experience with RLHF, constitutional AI, and production ML systems.',
      }),
    }
  )) passed++; else failed++;

  // Test 3: GET /api/researcher/qa (info)
  if (await testEndpoint(
    'Researcher Q&A Info',
    `${BASE_URL}/api/researcher/qa`
  )) passed++; else failed++;

  // Test 4: POST /api/researcher/qa (ask about researcher)
  if (await testEndpoint(
    'Ask About Researcher',
    `${BASE_URL}/api/researcher/qa`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'Does this researcher have industry experience?',
        researcher: {
          name: 'Dr. Sarah Chen',
          institution: 'University of São Paulo',
          bio: 'Assistant Professor of Computer Science specializing in AI Safety and Alignment.',
          experience: [
            'Research Scientist at OpenAI (2020-2022): Led safety research initiatives',
            'Research Intern at DeepMind (2018-2019): Worked on interpretability projects',
          ],
          papers: [
            {
              title: 'Scalable Oversight of AI Systems via Debate',
              abstract: 'We present a novel framework for scalable oversight of advanced AI systems using structured debate protocols.',
            },
          ],
        },
      }),
    }
  )) passed++; else failed++;

  // Test 5: GET /api/search (info)
  if (await testEndpoint(
    'Search API Info',
    `${BASE_URL}/api/search`
  )) passed++; else failed++;

  // Test 6: POST /api/search (search papers)
  if (await testEndpoint(
    'Search Research Papers',
    `${BASE_URL}/api/search`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'AI alignment and safety',
        limit: 5,
      }),
    }
  )) passed++; else failed++;

  // Test 7: GET /api/search with query params
  if (await testEndpoint(
    'Search Papers (GET)',
    `${BASE_URL}/api/search?q=debate+oversight&limit=3`
  )) passed++; else failed++;

  // Summary
  log(colors.cyan, '\n═══════════════════════════════════════');
  log(colors.cyan, '   Test Summary');
  log(colors.cyan, '═══════════════════════════════════════');
  log(colors.green, `   ✅ Passed: ${passed}`);
  if (failed > 0) {
    log(colors.red, `   ❌ Failed: ${failed}`);
  }
  log(colors.cyan, '═══════════════════════════════════════\n');

  if (failed === 0) {
    log(colors.green, '🎉 All tests passed!');
    process.exit(0);
  } else {
    log(colors.yellow, '⚠️  Some tests failed. Check the output above for details.');
    log(colors.yellow, '   Make sure the development server is running: npm run dev');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(colors.red, '\n❌ Test suite failed:', error.message);
  log(colors.yellow, '\nMake sure the development server is running:');
  log(colors.yellow, '  npm run dev\n');
  process.exit(1);
});
