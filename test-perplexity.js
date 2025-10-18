// Test script to verify Perplexity API is working
require('dotenv').config();

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

console.log('🔑 API Key:', PERPLEXITY_API_KEY ? `${PERPLEXITY_API_KEY.substring(0, 10)}...` : 'NOT SET');

async function testPerplexityAPI() {
  if (!PERPLEXITY_API_KEY) {
    console.error('❌ PERPLEXITY_API_KEY is not set in .env file');
    return;
  }

  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant with access to real-time web search.',
    },
    {
      role: 'user',
      content: 'Search Google Scholar for "Vishal Yadav" at "Queen Mary University of London" and list his papers. Return your response as JSON with a "papers" array containing paper titles.',
    },
  ];

  try {
    console.log('\n📡 Calling Perplexity API...\n');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages,
        return_citations: true,
        search_domain_filter: ['arxiv.org', 'scholar.google.com'],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    console.log(`📊 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${errorText}`);
      return;
    }

    const data = await response.json();

    console.log('\n✅ API Response received\n');
    console.log('Content:', data.choices[0]?.message?.content);
    console.log('\nCitations:', data.citations);
    console.log('\nUsage:', data.usage);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPerplexityAPI();
