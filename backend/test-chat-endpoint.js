import fetch from 'node-fetch';

async function testChatEndpoint() {
  try {
    console.log('Testing chat endpoint...');
    
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'How do I care for a puppy?'
      })
    });
    
    if (!response.ok) {
      console.error('HTTP Error:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testChatEndpoint();