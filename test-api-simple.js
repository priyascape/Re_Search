// Simple test without dependencies
const API_KEY = process.env.PERPLEXITY_API_KEY || 'your_api_key_here';

console.log('🔑 Testing Perplexity API...\n');

async function testAPI() {
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant.',
    },
    {
      role: 'user',
      content: 'Search Google Scholar for "Yann LeCun" at "New York University" and tell me about his top 2 papers. Return as JSON.',
    },
  ];

  try {
    console.log('📡 Making API request...\n');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',  // Latest Perplexity model
        messages,
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    console.log(`Status: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:');
      console.error(errorText);
      return;
    }

    const data = await response.json();

    console.log('✅ Success!\n');
    console.log('Response:');
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

testAPI();
