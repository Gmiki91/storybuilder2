import React, { createContext, useContext } from 'react';

export const AuthContext = createContext({authTokens:'', setAuthTokens:(data:React.SetStateAction<string>) => {}});

export const useAuth=()=> {
  return useContext(AuthContext);
}