import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, isAdmin } = useAuth();

  const fetchBookings = async (filters = {}) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = isAdmin 
        ? await api.getAllBookings(filters) 
        : await api.getMyBookings(filters);
      setBookings(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  // Listen for cross-tab booking updates and refresh
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'cfis_bookings_updated') {
        fetchBookings();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [isAuthenticated, isAdmin]);

  const addBooking = async (bookingData) => {
    try {
      setError(null);
      const newBooking = await api.createBooking(bookingData);
      setBookings(prev => [...prev, newBooking]);
      // notify other tabs/clients to refresh
      try { localStorage.setItem('cfis_bookings_updated', Date.now().toString()); } catch(e) {}
      return { success: true, booking: newBooking };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const cancelBooking = async (id) => {
    try {
      setError(null);
      const updatedBooking = await api.cancelBooking(id);
      setBookings(prev => prev.map(b => b._id === id ? updatedBooking : b));
      try { localStorage.setItem('cfis_bookings_updated', Date.now().toString()); } catch(e) {}
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const markAttended = async (id) => {
    try {
      setError(null);
      const updatedBooking = await api.markAsAttended(id);
      setBookings(prev => prev.map(b => b._id === id ? updatedBooking : b));
      try { localStorage.setItem('cfis_bookings_updated', Date.now().toString()); } catch(e) {}
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const markMissed = async (id) => {
    try {
      setError(null);
      const updatedBooking = await api.markAsMissed(id);
      setBookings(prev => prev.map(b => b._id === id ? updatedBooking : b));
      try { localStorage.setItem('cfis_bookings_updated', Date.now().toString()); } catch(e) {}
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const getBookingsByDate = (date) => {
    return bookings.filter(b => b.date === date);
  };

  const getBookingHistory = (filters = {}) => {
    let filtered = [...bookings];
    if (filters.status) filtered = filtered.filter(b => b.status === filters.status);
    if (filters.mealType) filtered = filtered.filter(b => b.mealType === filters.mealType);
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const refreshBookings = async () => {
    await fetchBookings();
  };

  return (
    <BookingContext.Provider 
      value={{ 
        bookings, 
        addBooking, 
        cancelBooking,
        markAttended,
        markMissed,
        getBookingsByDate, 
        getBookingHistory,
        refreshBookings,
        loading,
        error 
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => useContext(BookingContext);
