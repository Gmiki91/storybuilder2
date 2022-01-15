import React, { createContext, useContext } from 'react';

export const AuthContext = createContext({authToken:'', setAuthToken:(data:React.SetStateAction<string>) => {}});

export const useAuth=()=> {
  return useContext(AuthContext);
}