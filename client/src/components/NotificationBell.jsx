import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    
    // Load dismissed notifications from local storage and backend
    const [dismissed, setDismissed] = useState(() => {
        const saved = localStorage.getItem('dismissedNotifications');
        return saved ? JSON.parse(saved) : [];
    });

    // Sync state between Mobile and Desktop Navbars
    useEffect(() => {
        const handleUpdate = () => {
             const saved = localStorage.getItem('dismissedNotifications');
             if (saved) setDismissed(JSON.parse(saved));
        };
        window.addEventListener('notifications_updated', handleUpdate);
        return () => window.removeEventListener('notifications_updated', handleUpdate);
    }, []);

    // Only fetch for logged in students/users (optional, but good practice)
    useEffect(() => {
        if (!user) return;
        
        const fetchData = async () => {
            try {
                const [notifRes, dismissedRes] = await Promise.all([
                    api.get('/notifications'),
                    api.get('/notifications/dismissed').catch(() => ({ data: { dismissed: [] } }))
                ]);

                if (notifRes.data.success) {
                    setNotifications(notifRes.data.notifications);
                }

                // Merge local and remote dismissed
                if (dismissedRes.data && dismissedRes.data.dismissed) {
                    const localSaved = localStorage.getItem('dismissedNotifications');
                    const localDismissed = localSaved ? JSON.parse(localSaved) : [];
                    const merged = [...new Set([...localDismissed, ...dismissedRes.data.dismissed])];
                    setDismissed(merged);
                    localStorage.setItem('dismissedNotifications', JSON.stringify(merged));
                }

            } catch (error) {
                console.error('Failed to load notifications', error);
            }
        };
        fetchData();
    }, [user]);

    // Derived state: Active notifications
    const activeNotifications = notifications.filter(n => !dismissed.includes(n._id));
    const unreadCount = activeNotifications.length;

    const syncDismissedWithServer = async (newDismissed) => {
        if (user) {
            try {
                // Fire and forget
                api.post('/notifications/dismiss', { dismissedIds: newDismissed });
            } catch (err) {
                console.error('Failed to sync dismissed notifications', err);
            }
        }
    };

    const handleDismiss = (id, e) => {
        if (e) e.stopPropagation();
        const saved = localStorage.getItem('dismissedNotifications');
        const currentDismissed = saved ? JSON.parse(saved) : [];
        if (!currentDismissed.includes(id)) {
            const newDismissed = [...currentDismissed, id];
            setDismissed(newDismissed);
            localStorage.setItem('dismissedNotifications', JSON.stringify(newDismissed));
            window.dispatchEvent(new Event('notifications_updated'));
            syncDismissedWithServer(newDismissed);
        }
    };

    const handleClearAll = () => {
        const saved = localStorage.getItem('dismissedNotifications');
        const currentDismissed = saved ? JSON.parse(saved) : [];
        const allIds = notifications.map(n => n._id);
        const newDismissed = [...new Set([...currentDismissed, ...allIds])];
        setDismissed(newDismissed);
        localStorage.setItem('dismissedNotifications', JSON.stringify(newDismissed));
        window.dispatchEvent(new Event('notifications_updated'));
        syncDismissedWithServer(newDismissed);
    };
    
    if (!user) return null;

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-700 hover:text-primary transition-colors focus:outline-none"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-3">
                            {activeNotifications.length > 0 && (
                                <button 
                                    onClick={handleClearAll}
                                    className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Clear all
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {activeNotifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-sm">
                                No new notifications
                            </div>
                        ) : (
                            activeNotifications.map(notif => (
                                <div key={notif._id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative group">
                                    <div className="flex justify-between items-start mb-1 pr-6">
                                        <h4 className="font-semibold text-gray-800 text-sm">{notif.title}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                            notif.type === 'alert' ? 'bg-red-100 text-red-700' :
                                            notif.type === 'offer' ? 'bg-purple-100 text-purple-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {notif.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 pr-6">{notif.message}</p>
                                    <p className="text-[10px] text-gray-400 mt-2">
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </p>
                                    <button 
                                        onClick={(e) => handleDismiss(notif._id, e)}
                                        className="absolute top-4 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Dismiss"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
