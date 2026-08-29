export const mapFirebaseError = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const code = error.code || '';
  const message = error.message || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/user-disabled':
      return 'This user account has been disabled.';

    case 'auth/too-many-requests':
      return 'Too many login attempts. Please try again later.';

    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';

    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';

    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';

    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';

    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase console.';

    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';

    case 'auth/internal-error':
      return 'Firebase authentication internal error. Please try again.';

    case 'auth/unauthorized-domain':
      return 'This domain (localhost) is not authorized in Firebase OAuth settings.';

    default:
      if (message.includes('auth/') || message.includes('Firebase:')) {
        // Extract clean message from Firebase error string
        const cleanMsg = message.replace(/^Firebase:\s*/, '').replace(/\s*\(auth\/.*\)\.?$/, '');
        return cleanMsg || 'Authentication failed. Please check your details.';
      }
      return message || 'Authentication failed. Please try again.';
  }
};
