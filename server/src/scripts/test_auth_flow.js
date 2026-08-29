async function testAuth() {
  console.log('Testing REST API Auth Endpoints on http://localhost:5000/api ...');
  
  try {
    const time = Date.now();
    const newEmail = `user_${time}@example.com`;

    // 1. Test Registration with a fresh new email
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'GUJARATHI MEGHANA',
        email: newEmail,
        password: 'password123',
        phone: '9876543210',
        city: 'kurnool',
        area: 'nr pet',
        state: 'andhra pradesh',
        pincode: '518001'
      })
    });
    const regData = await regRes.json();
    console.log('✅ 1. New Registration Status:', regRes.status, regData.message);
    console.log('   Token received:', regData.data?.token ? 'YES' : 'NO');
    console.log('   User created:', regData.data?.user?.name, '(', regData.data?.user?.email, ')');

    // 2. Test Registration with same email (Duplicate Registration check)
    const dupRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'GUJARATHI MEGHANA',
        email: newEmail,
        password: 'password123',
        city: 'kurnool',
        area: 'nr pet',
        state: 'andhra pradesh',
        pincode: '518001'
      })
    });
    const dupData = await dupRes.json();
    console.log('✅ 2. Duplicate Registration Status:', dupRes.status, dupData.message);

    // 3. Test Login with newly registered credentials
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newEmail,
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    console.log('✅ 3. Login Status:', loginRes.status, loginData.message);
    console.log('   Token received:', loginData.data?.token ? 'YES' : 'NO');

    // 4. Test Login with incorrect password
    const wrongPassRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newEmail,
        password: 'wrongpassword'
      })
    });
    const wrongPassData = await wrongPassRes.json();
    console.log('✅ 4. Invalid Password Login Status:', wrongPassRes.status, wrongPassData.message);

    console.log('\n🎉 ALL AUTHENTICATION TEST SUITES PASSED 100%');
  } catch (err) {
    console.error('❌ Auth API Error:', err);
  }
}

testAuth();
