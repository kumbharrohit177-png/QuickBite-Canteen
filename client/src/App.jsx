import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
// Import other pages as placeholders for now to avoid errors, or create them
// For now, I'll create a simple placeholder for Menu
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsPage from './pages/TermsPage';
import RefundPolicy from './pages/RefundPolicy';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Menu from './pages/admin/Menu';
import Inventory from './pages/admin/Inventory';
import Users from './pages/admin/Users';
import Payments from './pages/admin/Payments';
import Notifications from './pages/admin/Notifications';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="min-h-screen flex flex-col font-sans">

        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route path="/" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Home />
              </main>
              <Footer />
            </>
          } />
          <Route path="/menu" element={<><Navbar /><main className="flex-grow"><MenuPage /></main><Footer /></>} />
          <Route path="/cart" element={<><Navbar /><main className="flex-grow"><CartPage /></main><Footer /></>} />
          <Route path="/login" element={<><Navbar /><main className="flex-grow"><Login /></main><Footer /></>} />
          <Route path="/signup" element={<><Navbar /><main className="flex-grow"><Signup /></main><Footer /></>} />
          <Route path="/orders" element={<><Navbar /><main className="flex-grow"><OrdersPage /></main><Footer /></>} />
          <Route path="/privacy" element={<><Navbar /><main className="flex-grow"><PrivacyPolicy /></main><Footer /></>} />
          <Route path="/terms" element={<><Navbar /><main className="flex-grow"><TermsPage /></main><Footer /></>} />
          <Route path="/refund-policy" element={<><Navbar /><main className="flex-grow"><RefundPolicy /></main><Footer /></>} />

          {/* Admin Routes with AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="menu" element={<Menu />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="users" element={<Users />} />
            <Route path="payments" element={<Payments />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>

      </div>
    </AuthProvider>
  );
}

export default App;
