import { createContext, useContext, useEffect } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { encodeUsername } from "../utils";

import { useLocalStorage } from "@uidotdev/usehooks";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);

  const fetchUserInfo = async (username) => {
    const userRef = ref(db, `users/${encodeUsername(username)}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();
    return userData;
  };

  const me = async () => {
    if (!user) return;
    const userData = await fetchUserInfo(user.username);
    setUser(userData);
  };

  const signIn = async (username) => {
    const userData = await fetchUserInfo(username);
    setUser(userData);
  };

  useEffect(() => {
    me();
  }, []);

  const authStore = {
    user,
    signIn,
  };

  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
