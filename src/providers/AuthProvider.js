import { createContext } from 'react';

import { useProvideAuth } from '../hooks';
// here we are adding out initial state
const initialState = {
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
  signup: () => {},
  updateUser: () => {},
  updateUserFriends: () => {},
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth(); // we are managing the initial state at useProviderAuth

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
