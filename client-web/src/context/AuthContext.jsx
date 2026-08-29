import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { mapFirebaseError } from '../utils/firebaseErrors';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Maintain Auth State across page reloads using Firebase onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Sync authenticated Firebase user with MongoDB Atlas backend
          const res = await api.post('/auth/google', {
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            avatar: firebaseUser.photoURL || '',
            googleId: firebaseUser.uid
          }).catch(() => null);

          if (res && (res.token || res.data?.token)) {
            const token = res.token || res.data?.token;
            const userData = res.user || res.data?.user;
            localStorage.setItem('neighborly_token', token);
            setUser(userData);
          } else {
            // Check stored backend token profile
            const storedToken = localStorage.getItem('neighborly_token');
            if (storedToken) {
              const profileRes = await api.get('/auth/profile').catch(() => null);
              if (profileRes) {
                setUser(profileRes.data || profileRes);
              } else {
                setUser({
                  email: firebaseUser.email,
                  name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                  avatar: firebaseUser.photoURL || ''
                });
              }
            } else {
              setUser({
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                avatar: firebaseUser.photoURL || ''
              });
            }
          }
        } catch (err) {
          console.error('Error syncing auth state with backend:', err);
        }
      } else {
        // If not in Firebase auth, check local backend token
        const token = localStorage.getItem('neighborly_token');
        if (token) {
          try {
            const profileRes = await api.get('/auth/profile');
            setUser(profileRes.data || profileRes);
          } catch (err) {
            localStorage.removeItem('neighborly_token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firebase Email/Password Sign-In
  const login = async (email, password) => {
    let firebaseUser = null;

    // 1. Authenticate with Firebase Authentication
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;
    } catch (fbError) {
      console.error('Firebase signInWithEmailAndPassword error:', fbError);
      
      // If user not in Firebase yet, attempt Firebase creation or map specific error
      if (fbError.code === 'auth/user-not-found' || fbError.code === 'auth/invalid-credential') {
        try {
          const newUserCred = await createUserWithEmailAndPassword(auth, email, password);
          firebaseUser = newUserCred.user;
        } catch (createErr) {
          const friendlyMsg = mapFirebaseError(fbError);
          throw new Error(friendlyMsg);
        }
      } else {
        const friendlyMsg = mapFirebaseError(fbError);
        throw new Error(friendlyMsg);
      }
    }

    // 2. Authenticate & Sync User Profile with MongoDB Atlas backend API
    try {
      const res = await api.post('/auth/login', { email, password }).catch(async () => {
        // If backend login fails, sync via google/firebase auth endpoint
        return await api.post('/auth/google', {
          email: firebaseUser.email,
          name: firebaseUser.displayName || email.split('@')[0],
          avatar: firebaseUser.photoURL || '',
          googleId: firebaseUser.uid
        });
      });

      const payload = res.data || res;
      if (payload && (payload.token || payload.data?.token)) {
        const token = payload.token || payload.data?.token;
        localStorage.setItem('neighborly_token', token);
      }
      const dbUser = payload.user || payload.data?.user || {
        email: firebaseUser.email,
        name: firebaseUser.displayName || email.split('@')[0]
      };
      setUser(dbUser);
      return dbUser;
    } catch (backendErr) {
      console.error('Backend sync error:', backendErr);
      const fallbackUser = {
        email: firebaseUser.email,
        name: firebaseUser.displayName || email.split('@')[0]
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  // Firebase Email/Password Registration
  const register = async (userData) => {
    const { email, password, name } = userData;
    let firebaseUser = null;

    // 1. Create User in Firebase Authentication
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;
    } catch (fbError) {
      console.error('Firebase createUserWithEmailAndPassword error:', fbError);
      if (fbError.code === 'auth/email-already-in-use') {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          firebaseUser = userCredential.user;
        } catch (signInErr) {
          const friendlyMsg = mapFirebaseError(fbError);
          throw new Error(friendlyMsg);
        }
      } else {
        const friendlyMsg = mapFirebaseError(fbError);
        throw new Error(friendlyMsg);
      }
    }

    // 2. Create User in MongoDB Atlas backend API
    try {
      const res = await api.post('/auth/register', userData).catch(async () => {
        return await api.post('/auth/google', {
          email: firebaseUser.email,
          name: name || firebaseUser.email.split('@')[0],
          avatar: '',
          googleId: firebaseUser.uid
        });
      });

      const payload = res.data || res;
      if (payload && (payload.token || payload.data?.token)) {
        const token = payload.token || payload.data?.token;
        localStorage.setItem('neighborly_token', token);
      }
      const dbUser = payload.user || payload.data?.user || {
        email: firebaseUser.email,
        name: name || email.split('@')[0]
      };
      setUser(dbUser);
      return dbUser;
    } catch (backendErr) {
      console.error('Backend register sync error:', backendErr);
      const fallbackUser = {
        email: firebaseUser.email,
        name: name || email.split('@')[0]
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  // Firebase Google Popup Sign-In
  const googleLogin = async () => {
    let firebaseUser = null;
    try {
      // 1. Authenticate with Firebase Google Auth Popup
      const result = await signInWithPopup(auth, googleProvider);
      firebaseUser = result.user;
    } catch (error) {
      console.error('Firebase Google Sign-In Error:', error);
      const friendlyMsg = mapFirebaseError(error);
      throw new Error(friendlyMsg);
    }

    // 2. Sync with MongoDB Atlas backend API
    try {
      const res = await api.post('/auth/google', {
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Google User',
        avatar: firebaseUser.photoURL || '',
        googleId: firebaseUser.uid
      });
      const payload = res.data || res;
      if (payload && (payload.token || payload.data?.token)) {
        const token = payload.token || payload.data?.token;
        localStorage.setItem('neighborly_token', token);
      }
      const dbUser = payload.user || payload.data?.user || {
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Google User',
        avatar: firebaseUser.photoURL || ''
      };
      setUser(dbUser);
      return dbUser;
    } catch (backendErr) {
      console.error('Backend google login sync error:', backendErr);
      const fallbackUser = {
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Google User',
        avatar: firebaseUser.photoURL || ''
      };
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  // Logout from Firebase and Clear Session
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase SignOut error:', err);
    } finally {
      localStorage.removeItem('neighborly_token');
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
