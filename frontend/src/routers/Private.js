import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";

export const Private = ({ children }) => {
  const context = useContext(AuthContext);

  useEffect(() => {
    if (!context?.auth) {
      window.location.href = "/login"; // Redirect to login page if auth is null
    }
  }, [context?.auth]);

  return context?.auth ? children : null;
};
