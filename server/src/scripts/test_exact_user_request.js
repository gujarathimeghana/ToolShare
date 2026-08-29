const http = require('http');

async function testExactUserRequest() {
  console.log('\n====================================================');
  console.log('🧪 TESTING EXACT USER TOOL LISTING SUBMISSION VIA HTTP');
  console.log('====================================================\n');

  const payload = JSON.stringify({
    title: 'Cordless Drill',
    category: 'Electrical',
    categoryName: 'Electrical',
    pricePerDay: 15,
    securityDeposit: 10,
    condition: 'Good',
    description: 'Drilling purpose',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500']
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/tools',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      console.log('1. HTTP Response Status Code:', res.statusCode);
      console.log('2. Response Payload:', data);

      if (res.statusCode === 201 || res.statusCode === 200) {
        console.log('\n====================================================');
        console.log('🎉 EXACT USER LISTING PUBLISHED & SAVED SUCCESSFULLY');
        console.log('====================================================\n');
      } else {
        console.error('❌ Failed HTTP status code:', res.statusCode);
      }
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('❌ HTTP Connection Error:', err.message);
    process.exit(1);
  });

  req.write(payload);
  req.end();
}

testExactUserRequest();
