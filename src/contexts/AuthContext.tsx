'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Hub } from 'aws-amplify/utils';
import { signIn, signOut, signUp, getCurrentUser, type SignUpInput } from 'aws-amplify/auth';

interface AuthContextType {
  user: any;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    const listener = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
        case 'signedOut':
          checkUser();
          break;
      }
    });

    return () => listener();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  }

  async function handleSignIn(username: string, password: string) {
    try {
      await signIn({ username, password });
      await checkUser();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  async function handleSignOut() {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  async function handleSignUp(username: string, password: string, email: string) {
    try {
      const signUpInput: SignUpInput = {
        username,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      };
      await signUp(signUpInput);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn: handleSignIn, signOut: handleSignOut, signUp: handleSignUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};