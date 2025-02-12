import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authCookie = Cookies.get('auth');
    if (authCookie) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    // TODO: Implement actual authentication logic with API
    if (username === 'admin' && password === 'admin123') {
      Cookies.set('auth', 'true', { expires: 7 }); // Cookie expires in 7 days
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('auth');
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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