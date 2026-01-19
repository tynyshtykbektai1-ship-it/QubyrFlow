"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export type UserRole = "guest" | "expert";

interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isExpert: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS: Record<string, { password: string; role: UserRole }> = {
  guest: { password: "guest123", role: "guest" },
  expert: { password: "expert123", role: "expert" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("pipeline_hub_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("pipeline_hub_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const userConfig = USERS[username.toLowerCase()];
    if (userConfig && userConfig.password === password) {
      const newUser = { username: username.toLowerCase(), role: userConfig.role };
      setUser(newUser);
      localStorage.setItem("pipeline_hub_user", JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pipeline_hub_user");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isExpert: user?.role === "expert" }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
