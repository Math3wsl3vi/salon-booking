"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/configs/firebaseConfig";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";

type CustomUser = FirebaseUser & { 
  isAdmin?: boolean;
  userType?: 'customer' | 'stylist' | 'admin';
};

type AuthContextType = {
  user: CustomUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  // Optional authentication methods
  loginRequired: (message?: string) => boolean;
  optionalAuth: boolean; // Flag to make auth optional site-wide
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuration - set this to true to make authentication optional
const OPTIONAL_AUTH_ENABLED = true;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        let isAdmin = false;
        let userType: 'customer' | 'stylist' | 'admin' = 'customer';

        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            isAdmin = userData.isAdmin || false;
            userType = userData.userType || 'customer';
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        setUser({ 
          ...firebaseUser, 
          isAdmin,
          userType 
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper methods for optional auth
  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin || false;

  const loginRequired = (message?: string): boolean => {
    if (OPTIONAL_AUTH_ENABLED) {
      // If auth is optional, always return true (no login required)
      return true;
    }
    
    // If auth is required and user is not logged in, you could:
    // - Redirect to login page
    // - Show a modal
    // - Return false to indicate login is required
    if (!isAuthenticated) {
      if (message) {
        console.warn(message);
      }
      return false;
    }
    return true;
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    loginRequired,
    optionalAuth: OPTIONAL_AUTH_ENABLED
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// Optional: Export a hook for protected routes that works with optional auth
export const useOptionalAuth = () => {
  const { user, loading, isAuthenticated, isAdmin, optionalAuth, loginRequired } = useAuth();
  
  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    optionalAuth,
    loginRequired,
    // Convenience method for components that work with or without auth
    getUserId: (): string => {
      if (optionalAuth) {
        return user?.uid || 'guest';
      }
      return user?.uid || '';
    },
    // Check if user can access admin features
    canAccessAdmin: (): boolean => {
      if (optionalAuth) {
        // If auth is optional, allow access if user is admin OR if no auth required
        return isAdmin || !isAuthenticated;
      }
      return isAdmin;
    }
  };
};