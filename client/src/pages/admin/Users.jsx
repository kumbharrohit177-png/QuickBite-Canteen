import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
    MagnifyingGlassIcon,
    ShieldCheckIcon,
    NoSymbolIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'student' : 'admin';
        if (window.confirm(`Are you sure you want to make ${user.name} an ${newRole}?`)) {
            try {
                await api.put(`/admin/users/${user._id}`, { role: newRole });
                toast.success('User role updated');
                // Optimistic UI update
                setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u));
            } catch (error) {
                toast.error('Failed to update role');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this user permanently? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/users/${id}`);
                toast.success('User deleted');
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const toggleBlock = (user) => {
        // Mock block functionality since we don't have an isBlocked schema property yet
        toast.success(`User ${user.name} has been ${user.isBlocked ? 'unblocked' : 'blocked'} (UI Only Demo)`);
        setUsers(users.map(u => u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u));
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage registered students and staff roles.</p>
                </div>

                <div className="relative w-full sm:w-72">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No users found.</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className={`hover:bg-gray-50 transition-colors ${user.isBlocked ? 'opacity-50 bg-red-50' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex justify-center items-center text-white font-bold text-lg">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{user.name} {user.isBlocked && '(Blocked)'}</div>
                                                    <div className={`text-xs ${user.googleId ? 'text-blue-600' : 'text-gray-500'}`}>
                                                        {user.googleId ? 'Google User' : 'Email User'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                            <div className="text-xs text-gray-500">{user.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => toggleRole(user)}
                                                    title={user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                                    className={`p-2 rounded-lg transition-colors ${user.role === 'admin' ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}
                                                >
                                                    <ShieldCheckIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => toggleBlock(user)}
                                                    title={user.isBlocked ? 'Unblock' : 'Block'}
                                                    className={`p-2 rounded-lg transition-colors ${user.isBlocked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                                >
                                                    <NoSymbolIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    title="Delete"
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
