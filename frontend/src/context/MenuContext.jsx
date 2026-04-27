import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenus = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllMenus(params);
      setMenus(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const addMenu = async (menuData) => {
    try {
      setError(null);
      const newMenu = await api.createMenu(menuData);
      setMenus(prev => [...prev, newMenu]);
      return { success: true, menu: newMenu };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const updateMenu = async (id, menuData) => {
    try {
      setError(null);
      const updatedMenu = await api.updateMenu(id, menuData);
      setMenus(prev => prev.map(m => m._id === id ? updatedMenu : m));
      return { success: true, menu: updatedMenu };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const deleteMenu = async (id) => {
    try {
      setError(null);
      await api.deleteMenu(id);
      setMenus(prev => prev.filter(m => m._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const getMenuByDate = (date) => {
    return menus.filter(m => m.date === date);
  };

  const refreshMenus = async () => {
    await fetchMenus();
  };

  return (
    <MenuContext.Provider 
      value={{ 
        menus, 
        addMenu, 
        updateMenu, 
        deleteMenu,
        getMenuByDate,
        refreshMenus,
        loading,
        error 
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMenu = () => useContext(MenuContext);
