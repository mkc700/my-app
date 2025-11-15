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
    console.log('UserContext: Setting up auth listener');
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      console.log('UserContext: Auth state changed:', event, !!session?.user);

      if (session?.user) {
        console.log('UserContext: User authenticated:', session.user.email);
        setUser(session.user);

        // Load user profile from Supabase asynchronously
        db.getUser(session.user.id).then(({ data: profile, error }) => {
          if (profile && !error) {
            console.log('UserContext: Profile loaded:', profile.displayName);
            setUserProfile(profile);
          } else {
            console.log('UserContext: Creating default profile');
            // Create default profile if it doesn't exist
            const defaultProfile = {
              uid: session.user.id,
              email: session.user.email,
              displayName: '',
              bio: '',
              age: '',
              work: '',
              school: '',
              location: '',
              photos: [],
              interests: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            db.setUser(session.user.id, defaultProfile).then(() => {
              setUserProfile(defaultProfile);
            }).catch(error => {
              console.error('UserContext: Error creating profile:', error);
            });
          }
        }).catch(error => {
          console.error('UserContext: Error loading user profile:', error);
        });
      } else {
        console.log('UserContext: User logged out');
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateProfile = async (updates) => {
    if (!user) return;

    try {
      const updatedProfile = {
        ...userProfile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const { error } = await db.updateUser(user.id, updatedProfile);

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
    updateProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
