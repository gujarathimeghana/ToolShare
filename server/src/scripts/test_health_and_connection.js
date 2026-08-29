const http = require('http');

function checkEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testConnection() {
  console.log('\n====================================================');
  console.log('🧪 TESTING EXPRESS BACKEND SERVER CONNECTION & HEALTH');
  console.log('====================================================\n');

  try {
    const health = await checkEndpoint('/api/health');
    console.log('1. Health Check Endpoint (/api/health):');
    console.log('   Status Code:', health.statusCode);
    console.log('   Response Body:', health.body);

    const tools = await checkEndpoint('/api/tools');
    console.log('\n2. Tools Endpoint (/api/tools):');
    console.log('   Status Code:', tools.statusCode);
    console.log('   Response Body Snippet:', tools.body.substring(0, 150) + '...');

    if (health.statusCode === 200 && tools.statusCode === 200) {
      console.log('\n====================================================');
      console.log('🎉 EXPRESS BACKEND IS RUNNING AND FULLY CONNECTED (PORT 5000)');
      console.log('====================================================\n');
    }
  } catch (err) {
    console.error('❌ Connection Error:', err.message);
  } finally {
    process.exit(0);
  }
}

testConnection();
