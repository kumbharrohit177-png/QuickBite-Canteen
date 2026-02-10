import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import logo from '../assets/logo.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully 👋");
        navigate('/');
        setIsOpen(false);
    };

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: id } });
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsOpen(false);
    };

    useEffect(() => {
        if (location.pathname === '/' && location.state?.scrollTo) {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            // Clear state after scrolling
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                {/* Main Header */}
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src={logo}
                            alt="QuickBite Logo"
                            className="h-10 w-auto object-contain"
                        />
                        <span className="text-2xl font-bold text-gray-800">
                            Quick<span className="text-primary">Bite</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">


                        {/* Navigation Links */}
                        <div className="flex items-center gap-6">
                            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
                                Home
                            </Link>
                            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-primary font-medium transition-colors">
                                About
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-primary font-medium transition-colors">
                                Contact
                            </button>
                            <Link to="/menu" className="text-gray-700 hover:text-primary font-medium transition-colors">
                                Menu
                            </Link>
                            <Link to="/orders" className="text-gray-700 hover:text-primary font-medium transition-colors">
                                Orders
                            </Link>
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2">
                            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary transition-colors" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User Account */}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800">{user.name || 'User'}</p>
                                    <p className="text-xs text-gray-500">Member</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
                            >
                                <User className="h-4 w-4" />
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-4">
                        <Link to="/cart" className="relative p-2">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-3 space-y-3">


                        <MobileNavLink to="/" label="Home" onClick={() => setIsOpen(false)} />
                        <MobileNavLink onClick={() => scrollToSection('about')} label="About" />
                        <MobileNavLink onClick={() => scrollToSection('contact')} label="Contact" />
                        <MobileNavLink to="/menu" label="Menu" onClick={() => setIsOpen(false)} />
                        <MobileNavLink to="/orders" label="Orders" onClick={() => setIsOpen(false)} />

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="h-4 w-4" />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLink({ to, label }) {
    return (
        <Link
            to={to}
            className="px-5 py-2.5 rounded-full text-gray-600 font-semibold hover:text-orange-600 hover:bg-orange-50/80 transition-all duration-200 relative group"
        >
            {label}
        </Link>
    );
}

function MobileNavLink({ to, label, onClick }) {
    if (!to) {
        return (
            <button
                className="block w-full text-left px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
                onClick={onClick}
            >
                {label}
            </button>
        );
    }
    return (
        <Link
            to={to}
            className="block px-3 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-primary transition-colors"
            onClick={onClick}
        >
            {label}
        </Link>
    );
}
