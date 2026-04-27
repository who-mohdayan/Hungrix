import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('cfis_token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser({ ...userData, isAdmin: userData.role === 'admin' });
        } catch (err) {
          console.error('Auth check failed:', err);
          api.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await api.login(email, password);
      const userData = { ...data, isAdmin: data.role === 'admin' };
      setUser(userData);
      localStorage.setItem('cfis_user', JSON.stringify(userData));
      return { success: true, isAdmin: data.isAdmin };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      
      // Check if this is an admin registration
      if (userData.role === 'admin') {
        const data = await api.registerAdmin(userData);
        const user = { ...data, isAdmin: true };
        setUser(user);
        localStorage.setItem('cfis_user', JSON.stringify(user));
        return { success: true };
      } else {
        // Student registration
        const data = await api.register(userData);
        const user = { ...data, isAdmin: false };
        setUser(user);
        localStorage.setItem('cfis_user', JSON.stringify(user));
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setError(null);
  };

  const updateUser = async (userData) => {
    try {
      setError(null);
      const updatedUser = await api.updateProfile(userData);
      setUser({ ...updatedUser, isAdmin: updatedUser.role === 'admin' });
      localStorage.setItem('cfis_user', JSON.stringify({ ...updatedUser, isAdmin: updatedUser.role === 'admin' }));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        updateUser,
        isAuthenticated: !!user, 
        isAdmin: user?.isAdmin || false,
        loading,
        error 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
