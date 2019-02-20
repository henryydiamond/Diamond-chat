import React, { createContext, useContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const AuthStateContext = createContext();

const AuthStateDispatch = createContext();

const token = localStorage.getItem('token');
let user = null;
if (token) {
  const decodedToken = jwtDecode(token);
  const expiresAt = new Date(decodedToken.exp * 1000);

  if (new Date() > expiresAt) {
    localStorage.removeItem(token);
  } else {
    user = decodedToken;
  }
} else console.log('No token found');

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
      };
    default:
      throw new Error(`Unknown action type:${action.type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user });

  return (
    <AuthStateContext.Provider value={state}>
      <AuthStateDispatch.Provider value={dispatch}>
        {children}
      </AuthStateDispatch.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthStateDispatch);
