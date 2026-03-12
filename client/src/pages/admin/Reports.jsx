import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    ArrowDownTrayIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Reports() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetching all orders to compute analytics locally for demo
                // In production, backend should compute tight aggregations
                const res = await api.get('/orders/all');
                setOrders(res.data);
            } catch (error) {
                toast.error('Failed to load report data');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // 1. Process Data: Peak Hours Map
    const hoursMap = {};
    orders.forEach(o => {
        const hour = new Date(o.createdAt).getHours();
        hoursMap[hour] = (hoursMap[hour] || 0) + 1;
    });
    const peakHoursData = Object.keys(hoursMap).map(h => ({
        hour: `${h}:00`,
        orders: hoursMap[h]
    })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    // 2. Process Data: Most Ordered Items
    const itemsMap = {};
    orders.forEach(o => {
        o.items.forEach(i => {
            itemsMap[i.name] = (itemsMap[i.name] || 0) + i.quantity;
        });
    });
    const topItemsData = Object.keys(itemsMap)
        .map(name => ({ name, quantity: itemsMap[name] }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5); // Top 5

    const COLORS = ['#F97316', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

    const downloadCSV = () => {
        if (orders.length === 0) return toast.error('No data to export');

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Token,Customer,Total Amount,Status\n";

        orders.forEach(o => {
            const row = [
                `"${new Date(o.createdAt).toLocaleDateString()}"`,
                `"${o.tokenNumber}"`,
                `"${o.user?.name || 'Guest'}"`,
                `"${o.totalAmount}"`,
                `"${o.status}"`
            ].join(",");
            csvContent += row + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `quickbite_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics 📈</h1>
                    <p className="text-gray-500 text-sm mt-1">Deep dive into canteen performance and student preferenes.</p>
                </div>

                <button
                    onClick={downloadCSV}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all shadow-sm"
                >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    Download CSV Report
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">Computing analytics...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Top Items Pie Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Most Ordered Items</h2>
                        <div className="h-80 w-full flex justify-center">
                            {topItemsData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topItemsData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={5}
                                            dataKey="quantity"
                                        >
                                            {topItemsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            formatter={(value, name) => [value + ' orders', name]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <div className="text-gray-400 mt-20">No order data yet</div>}
                        </div>
                        {/* Legend */}
                        <div className="mt-4 flex flex-col gap-2">
                            {topItemsData.map((item, index) => (
                                <div key={item.name} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-gray-700 font-medium">{item.name}</span>
                                    </div>
                                    <span className="text-gray-900 font-bold">{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Peak Hours Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Peak Operational Hours</h2>
                        <div className="h-80 w-full">
                            {peakHoursData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={peakHoursData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                        <Area type="monotone" dataKey="orders" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : <div className="flex justify-center mt-20 text-gray-400">No hourly data yet</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
