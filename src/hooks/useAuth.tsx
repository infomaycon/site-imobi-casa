import { createContext, useContext, useState, ReactNode } from "react";

// Stub user type (no Supabase dependency)
export interface AppUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ data: { user: AppUser | null } | null; error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Stub AuthProvider — no backend connected.
 * Replace with Cloudflare-based auth when ready.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<AppUser | null>(null);
  const [loading] = useState(false);

  const signIn = async (_email: string, _password: string) => {
    return { error: new Error("Auth not configured. Connect a backend.") };
  };

  const signUp = async (_email: string, _password: string) => {
    return { data: null, error: new Error("Auth not configured. Connect a backend.") };
  };

  const signOut = async () => {
    // no-op
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
