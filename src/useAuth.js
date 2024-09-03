import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./authContext";

export function useAuth() {
  const { isLoggedIn, login, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && !isLoggedIn) {
      login();  // Automatically log in if the token exists
    }
  }, [isLoggedIn, login]);

  return { isLoggedIn, login, logout };
}
