import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { auth, googleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('neighborly_token');
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          const userData = res.data || res;
          setUser(userData);
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error('[AuthContext Profile Fetch Error]:', err);
          }
          localStorage.removeItem('neighborly_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    let firebaseUid = '';
    
    // Attempt Firebase Authentication if available
    try {
      if (auth) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        firebaseUid = userCred.user?.uid || '';
      }
    } catch (fbErr) {
      if (import.meta.env.DEV) {
        console.warn('[Firebase Auth Login Notice]:', fbErr.message);
      }
    }

    // Authenticate with Backend API & retrieve MongoDB profile
    const res = await api.post('/auth/login', { email, password, firebaseUid });
    const payload = res.data || res;
    
    if (payload.token) {
      localStorage.setItem('neighborly_token', payload.token);
    }
    if (payload.user) {
      setUser(payload.user);
    }
    return payload;
  };

  const register = async (userData) => {
    let firebaseUid = '';

    // Attempt Firebase Account Creation if available
    try {
      if (auth && userData.email && userData.password) {
        const userCred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        firebaseUid = userCred.user?.uid || '';
      }
    } catch (fbErr) {
      if (import.meta.env.DEV) {
        console.warn('[Firebase Auth Register Notice]:', fbErr.message);
      }
      if (fbErr.code === 'auth/email-already-in-use') {
        throw new Error('Email is already registered. Please login.');
      }
    }

    // Create MongoDB User Profile in Backend API
    const res = await api.post('/auth/register', { ...userData, firebaseUid });
    const payload = res.data || res;

    if (payload.token) {
      localStorage.setItem('neighborly_token', payload.token);
    }
    if (payload.user) {
      setUser(payload.user);
    }
    return payload;
  };

  const googleLogin = async (googleData) => {
    let firebaseUid = googleData?.googleId || '';
    let email = googleData?.email || '';
    let name = googleData?.name || '';
    let avatar = googleData?.avatar || '';

    // Attempt Firebase Google Popup if triggered
    try {
      if (auth && googleProvider && !googleData?.email) {
        const result = await signInWithPopup(auth, googleProvider);
        firebaseUid = result.user.uid;
        email = result.user.email;
        name = result.user.displayName;
        avatar = result.user.photoURL;
      }
    } catch (fbErr) {
      if (import.meta.env.DEV) {
        console.warn('[Firebase Google Popup Notice]:', fbErr.message);
      }
    }

    const res = await api.post('/auth/google', {
      email: email || 'user.google@neighborly.app',
      name: name || 'Google Neighbor',
      avatar,
      firebaseUid
    });
    const payload = res.data || res;

    if (payload.token) {
      localStorage.setItem('neighborly_token', payload.token);
    }
    if (payload.user) {
      setUser(payload.user);
    }
    return payload;
  };

  const logout = () => {
    try {
      if (auth) {
        auth.signOut();
      }
    } catch (err) {
      console.warn('Firebase signout notice:', err);
    }
    localStorage.removeItem('neighborly_token');
    setUser(null);
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
