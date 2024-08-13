// contexts/AuthContext.js

import { createContext, useState, useEffect } from "react";

import {
  signUpNewAccountAPI,
  logInAccountAPI,
  detailsAccountAPI,
} from "~/apis/index";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Initialize auth state from localStorage
    const token = localStorage.getItem("authToken");

    return token
      ? { token, isAuthenticated: true }
      : { token: null, isAuthenticated: false };
  });

  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Save token to localStorage when auth state changes
    if (auth.token) {
      getUserDetails(auth.token);
      localStorage.setItem("authToken", auth.token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [auth]);

  const saveToken = (token) => {
    localStorage.setItem("authToken", token);
    // setAuthToken(token);
    setAuth({ token: token });
  };

  const registerUser = async (userData) => {
    try {
      const result = await signUpNewAccountAPI(userData);

      if (result.status === 201) {
        const { token } = result.data;
        saveToken(token);

        return { success: true };
      } else {
        throw new Error(result);
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "An unexpected error occurred",
      };
    }
  };

  const logInAccount = async (userData) => {
    try {
      const result = await logInAccountAPI(userData);

      if (result.status === 200) {
        const { token } = result.data;
        // saveToken(token);
        setAuth({ token, isAuthenticated: true });

        return { success: true, token };
      } else {
        throw new Error(result);
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "An unexpected error occurred",
      };
    }
  };

  const getUserDetails = async (authToken) => {
    try {
      const response = await detailsAccountAPI(authToken);
      setLoggedInUser(response.data);

      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data", error);

      localStorage.removeItem("authToken");
      setAuth({ token: null, isAuthenticated: false });
      setLoggedInUser(null);
      // setAuthToken(null);
    }
  };

  const logOutAccount = () => {
    localStorage.removeItem("authToken");
    // setAuthToken(null);
    setAuth({ token: null, isAuthenticated: false });
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        loggedInUser,
        registerUser,
        logInAccount,
        getUserDetails,
        logOutAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
