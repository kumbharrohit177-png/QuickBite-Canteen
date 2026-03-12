import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
    PaperAirplaneIcon,
    MegaphoneIcon,
    GiftIcon,
    BellAlertIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'announcement'
    });

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/admin/notifications');
            if (res.data.success) {
                setNotifications(res.data.notifications);
            }
        } catch (error) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/notifications', formData);
            toast.success('Notification sent successfully!');
            setFormData({ title: '', message: '', type: 'announcement' });
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to send notification');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/notifications/${id}`);
            toast.success('Notification deleted');
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'offer': return <GiftIcon className="h-6 w-6 text-purple-500" />;
            case 'alert': return <BellAlertIcon className="h-6 w-6 text-red-500" />;
            default: return <MegaphoneIcon className="h-6 w-6 text-blue-500" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'offer': return 'bg-purple-100 text-purple-800';
            case 'alert': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Notification Center</h1>
                <p className="text-gray-500 text-sm mt-1">Broadcast announcements, offers, or alerts to all users.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Send Notification Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <PaperAirplaneIcon className="h-5 w-5 text-orange-500" />
                            Compose Message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Canteen closed tomorrow"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white transition-colors"
                                >
                                    <option value="announcement">General Announcement</option>
                                    <option value="offer">Special Offer</option>
                                    <option value="alert">Alert / Emergency</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Type your message here..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white transition-colors resize-none"
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all font-bold">
                                <PaperAirplaneIcon className="h-5 w-5" />
                                Send Broadcast
                            </button>
                        </form>
                    </div>
                </div>

                {/* Notification History */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 px-1">Recent Broadcasts</h2>

                    {loading ? (
                        <div className="bg-white rounded-2xl p-10 text-center text-gray-500 border border-gray-100 shadow-sm">Loading history...</div>
                    ) : notifications.length === 0 ? (
                        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
                            <MegaphoneIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <h3 className="text-gray-900 font-medium">No active notifications</h3>
                            <p className="text-gray-500 text-sm mt-1">Sent messages will appear here.</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div key={notif._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 transition-all hover:shadow-md relative group">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                        {getTypeIcon(notif.type)}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-gray-900 text-lg">{notif.title}</h3>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${getTypeColor(notif.type)}`}>
                                            {notif.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">{notif.message}</p>
                                    <p className="text-gray-400 text-xs mt-3 font-medium">
                                        {new Date(notif.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(notif._id)}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete notification"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
