import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../supabase.js';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      console.log('UserContext: Loading current user');
      const { user, error } = await auth.getCurrentUser();

      if (user && !error) {
        console.log('UserContext: User loaded:', user.email);
        setUser(user);
        setUserProfile(user); // Since user from getCurrentUser includes profile data
      } else {
        console.log('UserContext: No user logged in');
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await auth.signIn({ email, password });
    if (error) throw error;
    setUser(data.user);
    setUserProfile(data.user);
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return;

    try {
      const updatedProfile = {
        ...userProfile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const { error } = await db.updateUser(user.uid, updatedProfile);

      if (error) {
        throw error;
      }

      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    logout,
    updateProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
