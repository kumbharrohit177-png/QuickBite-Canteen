import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// Import other pages as placeholders for now to avoid errors, or create them
// For now, I'll create a simple placeholder for Menu
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
        <footer className="bg-white py-6 text-center text-gray-400 text-sm border-t border-gray-100">
          © 2026 QuickBite. Smart Canteen System.
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
