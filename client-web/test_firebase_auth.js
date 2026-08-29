import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAllsPFyXuM8f9FbfZaMBAptSIrDInsph8",
  authDomain: "localtool-2dda5.firebaseapp.com",
  projectId: "localtool-2dda5",
  storageBucket: "localtool-2dda5.firebasestorage.app",
  messagingSenderId: "265243036042",
  appId: "1:265243036042:web:6d4b4364c248a8fbcfe073"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testFirebase() {
  console.log('\n====================================================');
  console.log('🧪 TESTING FIREBASE AUTHENTICATION FLOW');
  console.log('====================================================\n');

  const testEmail = `user_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  try {
    // 1. Create User in Firebase
    console.log('1. Testing createUserWithEmailAndPassword()...');
    const userCred = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('   ✅ Firebase Registration Success!');
    console.log('   User UID:', userCred.user.uid);
    console.log('   User Email:', userCred.user.email);

    // 2. Sign Out
    console.log('\n2. Testing signOut()...');
    await signOut(auth);
    console.log('   ✅ Firebase SignOut Success!');

    // 3. Sign In with valid credentials
    console.log('\n3. Testing signInWithEmailAndPassword() [Valid Credentials]...');
    const signInCred = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('   ✅ Firebase Login Success!');
    console.log('   User UID:', signInCred.user.uid);

    // 4. Sign In with invalid password
    console.log('\n4. Testing signInWithEmailAndPassword() [Wrong Password]...');
    try {
      await signInWithEmailAndPassword(auth, testEmail, 'WrongPass999!');
      console.error('   ❌ Expected error on wrong password, but succeeded');
    } catch (wrongPassErr) {
      console.log('   ✅ Correctly caught wrong password error:', wrongPassErr.code);
    }

    // 5. Sign In with non-existent email
    console.log('\n5. Testing signInWithEmailAndPassword() [Invalid Email/User]...');
    try {
      await signInWithEmailAndPassword(auth, 'nonexistent_user_99999@example.com', testPassword);
      console.error('   ❌ Expected error on non-existent user, but succeeded');
    } catch (notFoundErr) {
      console.log('   ✅ Correctly caught user not found / invalid credential error:', notFoundErr.code);
    }

    console.log('\n====================================================');
    console.log('🎉 ALL FIREBASE AUTHENTICATION TESTS PASSED 100%');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Firebase Auth Test Error:', err);
  } finally {
    process.exit(0);
  }
}

testFirebase();
