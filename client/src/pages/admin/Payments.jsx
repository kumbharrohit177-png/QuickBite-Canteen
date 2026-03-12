import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    BanknotesIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon,
    XCircleIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Payments() {
    // Re-use orders endpoint to extract payment data since Order schema tracks paymentStatus
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await api.get('/orders/all');
                // Map orders to a payment-centric shape
                const mapped = res.data.map(order => ({
                    _id: order._id,
                    transactionId: `TXN${order.tokenNumber}${String(order.createdAt).substring(order.createdAt.length - 4)}`,
                    user: order.user?.name || 'Guest',
                    amount: order.totalAmount,
                    status: order.paymentStatus,
                    date: new Date(order.createdAt).toLocaleString(),
                    orderRef: order.tokenNumber
                }));
                setPayments(mapped);
            } catch (error) {
                console.error('Failed to load payments', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const filtered = payments.filter(p =>
        p.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExportCSV = () => {
        if (filtered.length === 0) {
            alert('No payments to export');
            return;
        }

        // CSV Headers
        const headers = ['Transaction ID', 'Date & Time', 'Customer', 'Order Ref', 'Amount (INR)', 'Status'];
        
        // CSV Rows
        const rows = filtered.map(p => [
            p.transactionId,
            `"${p.date}"`, // wrap in quotes to handle commas in date
            `"${p.user}"`,
            p.orderRef,
            p.amount,
            p.status === 'Paid' || p.status === 'Success' ? 'Successful' : 'Pending'
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        // Create Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `payment_logs_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Payment Logs</h1>
                    <p className="text-gray-500 text-sm mt-1">Review all successful and pending transactions.</p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search TXN ID or User..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white"
                        />
                    </div>
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Ref</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading records...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No transactions found.</td></tr>
                            ) : (
                                filtered.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono font-medium text-gray-900">{payment.transactionId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {payment.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{payment.user}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            #{payment.orderRef}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                            ₹{payment.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {payment.status === 'Paid' || payment.status === 'Success' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircleIcon className="h-4 w-4" /> Successful
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </span>
                                            )}
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
