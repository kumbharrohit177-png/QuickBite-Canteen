import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    BuildingStorefrontIcon,
    ClipboardDocumentListIcon,
    QueueListIcon,
    TagIcon,
    UsersIcon,
    BanknotesIcon,
    ArchiveBoxIcon,
    ChartBarIcon,
    BellAlertIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: BuildingStorefrontIcon },
        { name: 'Orders', path: '/admin/orders', icon: ClipboardDocumentListIcon },
        { name: 'Menu', path: '/admin/menu', icon: QueueListIcon },
        // { name: 'Categories', path: '/admin/categories', icon: TagIcon }, // Can be part of menu or separate
        { name: 'Inventory', path: '/admin/inventory', icon: ArchiveBoxIcon },
        { name: 'Users', path: '/admin/users', icon: UsersIcon },
        { name: 'Payments', path: '/admin/payments', icon: BanknotesIcon },
        { name: 'Reports', path: '/admin/reports', icon: ChartBarIcon },
        { name: 'Notifications', path: '/admin/notifications', icon: BellAlertIcon },
        { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-center h-20 border-b border-gray-100 px-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        QuickBite Admin
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.path === '/admin'} // Exact match for dashboard
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-md shadow-orange-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
                                }`
                            }
                        >
                            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Viewport */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header for Mobile */}
                <header className="bg-white shadow-sm lg:hidden flex items-center justify-between px-4 h-16 shrink-0 z-10">
                    <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-700 p-2 focus:outline-none"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
