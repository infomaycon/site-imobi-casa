import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type AdminTheme = "light" | "dark" | "black";

interface Ctx {
  theme: AdminTheme;
  setTheme: (t: AdminTheme) => void;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "admin-theme";

export const AdminThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<AdminTheme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(STORAGE_KEY) as AdminTheme) || "dark";
  });

  useEffect(() => {
    const body = document.body;
    body.dataset.adminTheme = theme;
    // also toggle .dark for shadcn components that key off it
    if (theme === "dark" || theme === "black") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, theme);
    return () => {
      // do not cleanup on unmount — keep theme across pages
    };
  }, [theme]);

  const setTheme = useCallback((t: AdminTheme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : prev === "dark" ? "black" : "light"));
  }, []);

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return ctx;
};