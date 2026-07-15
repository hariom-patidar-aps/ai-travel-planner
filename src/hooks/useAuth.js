import { useEffect, useState } from "react";
import {
  subscribeToAuth,
  logoutUser,
} from "../services/authService";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    user,
    loading,
    logout,
    isLoggedIn: !!user,
  };
}