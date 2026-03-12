import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import {
    MagnifyingGlassIcon,
    PrinterIcon,
    ChevronDownIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/all'); // Need to ensure JWT has admin role or public for now
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Socket.io for new order real-time updates
        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            console.log('Admin Socket connected for real-time orders');
        });

        socket.on('newOrderReceived', (newOrder) => {
            // Check if we already have it to avoid duplicates
            setOrders(prevOrders => {
                if (!prevOrders.some(o => o._id === newOrder._id)) {
                    toast.success(`New Order Received: #${newOrder.tokenNumber}`, {
                        icon: '🔥',
                        duration: 5000
                    });
                    // Add the new order at the beginning of the list
                    return [newOrder, ...prevOrders];
                }
                return prevOrders;
            });
        });

        socket.on('orderStatusUpdated', (updatedOrder) => {
            setOrders(prevOrders => prevOrders.map(o => o._id === updatedOrder._id ? { ...o, status: updatedOrder.status } : o));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order marked as ${newStatus}`);
            // Update local state without refetching to feel snappier
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handlePrint = (order) => {
        // Basic print bill functionality
        const printWindow = window.open('', '', 'width=600,height=800');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Bill - ${order.tokenNumber}</title>
                    <style>
                        body { font-family: monospace; padding: 20px; }
                        h2 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border-bottom: 1px dashed #000; padding: 5px; text-align: left; }
                        .total { font-weight: bold; font-size: 1.2em; text-align: right; margin-top: 10px; }
                    </style>
                </head>
                <body>
                    <h2>QuickBite Canteen</h2>
                    <p>Token: ${order.tokenNumber}</p>
                    <p>Customer: ${order.user?.name || 'Unknown'}</p>
                    <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
                    ${order.instructions ? `<p><strong>Instructions:</strong> ${order.instructions}</p>` : ''}
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(i => `
                                <tr>
                                    <td>${i.name}</td>
                                    <td>${i.quantity}</td>
                                    <td>${i.price * i.quantity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="total">Total: ₹${order.totalAmount}</div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Derived filtered data
    const filteredOrders = orders.filter(o => {
        const matchesSearch =
            o.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Preparing': 'bg-blue-100 text-blue-800',
        'Ready': 'bg-green-100 text-green-800',
        'Collected': 'bg-gray-100 text-gray-800',
        'Cancelled': 'bg-red-100 text-red-800',
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Review and manage all incoming orders</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search token or user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full sm:w-64"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="py-2 pl-3 pr-10 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Collected">Collected</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                    <QueueListIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-gray-900">#{order.tokenNumber}</div>
                                            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.user?.name || 'Guest'}</div>
                                            {/* <div className="text-sm text-gray-500">{order.user?.phone || 'No phone'}</div> */}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                            </div>
                                            {order.instructions && (
                                                <div className="text-xs text-orange-600 bg-orange-50 mt-1 p-1 rounded-sm border border-orange-100 italic truncate max-w-xs">
                                                    Note: {order.instructions}
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-500 mt-1">Slot: {order.pickupSlot || 'ASAP'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">₹{order.totalAmount}</div>
                                            <div className="text-xs text-green-600 font-medium">
                                                {order.paymentStatus}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">

                                                {/* Status Dropdown */}
                                                <div className="relative inline-block text-left group">
                                                    <button type="button" className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                                        Update Status
                                                        <ChevronDownIcon className="-mr-1 ml-2 h-4 w-4" />
                                                    </button>

                                                    {/* Invisible bridge wrapper */}
                                                    <div className="absolute right-0 top-full pt-1 w-40 hidden group-hover:block z-50">
                                                        <div className="origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                                                            <div className="py-1">
                                                                {['Pending', 'Preparing', 'Ready', 'Collected', 'Cancelled'].map(s => (
                                                                    <button
                                                                        key={s}
                                                                        onClick={() => updateOrderStatus(order._id, s)}
                                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                                    >
                                                                        Mark {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Print Bill Button */}
                                                <button
                                                    onClick={() => handlePrint(order)}
                                                    title="Print Bill"
                                                    className="p-2 text-gray-400 hover:text-orange-600 border border-gray-300 rounded-md hover:bg-orange-50 transition-colors"
                                                >
                                                    <PrinterIcon className="h-5 w-5" />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }
        </div >
    );
}
