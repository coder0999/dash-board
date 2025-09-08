import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useUI } from '../context/UIContext';

const useAuth = () => {
  const { showAlert } = useUI();
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        // This is a returning user. We trust them because revocation is
        // handled by disabling the account in Firebase Authentication.
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData({ ...docSnap.data(), uid: user.uid });
          setAuthUser(user);
        } else {
          // This is an edge case where the user is authenticated with Firebase,
          // but their user document in Firestore has been deleted.
          // We will sign them out to be safe.
          await signOut(auth);
        }
      } else {
        setAuthUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // For a new login, we check the allowed_emails list.
      const accessControlRef = doc(db, "config", "access_control");
      const accessControlSnap = await getDoc(accessControlRef);

      if (accessControlSnap.exists() && accessControlSnap.data().allowed_emails?.includes(user.email)) {
        // User is on the list. Create their document if it doesn't exist.
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date()
          });
        }
        // The onAuthStateChanged listener will now handle setting the user state.
      } else {
        // User is not on the list. Show an error and sign them out completely.
        showAlert('لست مصرح لك بالدخول لهذا الموقع', 'error');
        await signOut(auth);
      }
    } catch (err) {
      // This can happen if the user closes the popup.
      console.error("Login failed or was cancelled", err);
    }
  };

  const handleLogout = () => {
    return signOut(auth).catch(err => {
      console.error("Logout failed", err);
    });
  };

  return { authUser, userData, loading, handleLogin, handleLogout };
};

export default useAuth;