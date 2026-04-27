import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { MenuProvider } from './context/MenuContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <MenuProvider>
            <AppRoutes />
          </MenuProvider>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
