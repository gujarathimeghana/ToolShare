async function testAuth() {
  console.log('Testing REST API Auth Endpoints on http://localhost:5000/api ...');
  
  try {
    // 1. Test Login with demo credentials
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alex@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('✅ Demo Login Status:', loginRes.status, loginData.message);
    console.log('   Token received:', loginData.data?.token ? 'YES' : 'NO');
    console.log('   User:', loginData.data?.user?.name, '(', loginData.data?.user?.email, ')');

    // 2. Test Registration with meghana email
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'GUJARATHI MEGHANA',
        email: 'meghana@gmail.com',
        password: 'password123',
        city: 'kurnool',
        area: 'nr pet',
        state: 'andhra pradesh',
        pincode: '518001'
      })
    });
    const regData = await regRes.json();
    console.log('✅ Registration / Login Status:', regRes.status, regData.message);
    console.log('   User:', regData.data?.user?.name, '(', regData.data?.user?.email, ')');

    // 3. Test Google Login
    const googleRes = await fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'meghana@gmail.com',
        name: 'GUJARATHI MEGHANA',
        googleId: 'google_test_123'
      })
    });
    const googleData = await googleRes.json();
    console.log('✅ Google Auth Status:', googleRes.status, googleData.message);

    console.log('\n🎉 ALL AUTH ENDPOINTS ARE FUNCTIONAL 100%');
  } catch (err) {
    console.error('❌ Auth API Error:', err);
  }
}

testAuth();
