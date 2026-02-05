import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200/50 shadow-md transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-24 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src={logo}
                            alt="QuickBite Logo"
                            className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                        />
                        <span className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 group-hover:to-orange-600 transition-all duration-300">
                            QuickBite
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink to="/" label="Home" />
                        <NavLink to="/menu" label="Menu" />
                        <NavLink to="/orders" label="My Orders" />

                        <div className="ml-6 pl-6 border-l border-gray-200">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-gray-800">{user.name || 'User'}</span>
                                        <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">Member</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200 hover:shadow-sm ring-1 ring-transparent hover:ring-red-100"
                                        title="Logout"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-orange-600 hover:to-amber-500 transition-all duration-300 shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="font-semibold">Login</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {user && (
                            <span className="text-sm font-semibold text-gray-700">{user.name?.split(' ')[0] || 'User'}</span>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass border-t border-gray-100 animate-fade-in absolute w-full left-0 bg-white/95 backdrop-blur-xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <MobileNavLink to="/" label="Home" onClick={() => setIsOpen(false)} />
                        <MobileNavLink to="/menu" label="Menu" onClick={() => setIsOpen(false)} />
                        <MobileNavLink to="/orders" label="My Orders" onClick={() => setIsOpen(false)} />

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-medium transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-medium shadow-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="h-5 w-5" />
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
    return (
        <Link
            to={to}
            className="block px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors"
            onClick={onClick}
        >
            {label}
        </Link>
    );
}
