import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider).catch(err => {
      console.error("Login failed", err);
      // Here you could show a custom alert to the user
    });
  };

  const handleLogout = () => {
    return signOut(auth).catch(err => {
      console.error("Logout failed", err);
    });
  };

  return { user, loading, handleLogin, handleLogout };
};

export default useAuth;
