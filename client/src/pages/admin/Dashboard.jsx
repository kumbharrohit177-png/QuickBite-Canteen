import React, { useState, useEffect } from 'react';
import {
    ShoppingBagIcon,
    BanknotesIcon,
    ClockIcon,
    QueueListIcon,
    UsersIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalOrdersToday: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        totalMenuItems: 0,
        totalUsers: 0,
        weeklySales: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                if (res.data.success) {
                    // Reverse weeklySales to show chronological order (oldest -> newest)
                    const chronologicalSales = res.data.stats.weeklySales.reverse();
                    setStats({ ...res.data.stats, weeklySales: chronologicalSales });
                }
            } catch (error) {
                console.error('Failed to fetch stats', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading Dashboard...</div>;
    }

    const statCards = [
        { title: 'Total Orders Today', value: stats.totalOrdersToday, icon: ShoppingBagIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Today’s Revenue', value: `₹${stats.todayRevenue}`, icon: BanknotesIcon, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Pending Orders', value: stats.pendingOrders, icon: ClockIcon, color: 'text-orange-600', bg: 'bg-orange-100' },
        { title: 'Total Menu Items', value: stats.totalMenuItems, icon: QueueListIcon, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'Total Users', value: stats.totalUsers, icon: UsersIcon, color: 'text-teal-600', bg: 'bg-teal-100' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Canteen Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Quick snapshot of today's performance</p>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between transition-transform hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">
                <div className="flex items-center mb-6">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-gray-500 mr-2" />
                    <h2 className="text-lg font-bold text-gray-800">Weekly Sales Graph</h2>
                </div>

                <div className="h-80 w-full">
                    {stats.weeklySales.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.weeklySales} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    tickFormatter={(val) => `₹${val}`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex justify-center items-center h-full text-gray-400">
                            No sales data available for the past week.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
