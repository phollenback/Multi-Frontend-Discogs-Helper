import React, { createContext, useState, useContext as useReactContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useApi } from './utility/backSource';

// Create a Context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const { postData } = useApi();
  const [cookies, setCookies, removeCookie] = useCookies();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // State to hold the authentication data (user info)
  const [authState, setAuthState] = useState({
    userId: '',
    username: '',
    email: '',
    token: ''
  });

  const login = async (data) => {
    try {
      // Make the request to the backend to authenticate the user
      const userData = await postData('/api/users/auth', data);
  
      setCookies('token', userData.token, { path: '/' }); // set the token in cookies
  
      setIsAuthenticated(true);
  
      // Update the auth state with user data
      setAuthState({
        userId: userData.user.userId,    
        username: userData.user.username, 
        email: userData.user.email,       
        token: userData.token,           
      });
  
      return true;
    } catch (error) {
      // Handle the error (e.g., incorrect credentials)
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Function to log out the user
  const logout = () => {
    setAuthState({
      userId: '',
      username: '',
      email: '',
      token: '',
    });

    removeCookie('token');

    setIsAuthenticated(false);
  };

  useEffect(() => {
    console.log('Auth State update:', authState);
  }, [authState]); 

  return (
    <AuthContext.Provider value={{ isAuthenticated, authState, login, logout, cookies }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuthContext = () => useReactContext(AuthContext);