import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const useAuth = () => {
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        try {
          // Determine the user's correct role on every auth state change.
          const accessControlRef = doc(db, "config", "access_control");
          const accessControlSnap = await getDoc(accessControlRef);
          const isAllowed = accessControlSnap.exists() && 
                            accessControlSnap.data().allowed_emails?.map(e => e.toLowerCase()).includes(user.email.toLowerCase());
          const expectedRole = isAllowed ? 'admin' : 'user';

          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          let finalUserData;

          if (docSnap.exists()) {
            // User exists. Update role if it's different.
            if (docSnap.data().role !== expectedRole) {
              await updateDoc(userRef, { role: expectedRole });
              finalUserData = { ...docSnap.data(), role: expectedRole };
            } else {
              finalUserData = docSnap.data();
            }
          } else {
            // New user. Create the document.
            finalUserData = {
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date(),
              role: expectedRole
            };
            await setDoc(userRef, finalUserData);
          }
          
          setUserData({ ...finalUserData, uid: user.uid });
          setAuthUser(user);

        } catch (error) {
          console.error("Error during auth state processing:", error);
          // If there's a permissions error here, it's critical. Sign out.
          await signOut(auth);
          setAuthUser(null);
          setUserData(null);
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
      await signInWithPopup(auth, provider);
      // All other logic is now correctly handled by the onAuthStateChanged listener.
    } catch (err) {
      console.error("Login popup failed or was cancelled", err);
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