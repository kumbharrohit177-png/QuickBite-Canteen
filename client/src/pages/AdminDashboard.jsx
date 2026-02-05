import { useState } from 'react';
import { Clock, CheckCircle, ChefHat } from 'lucide-react';

// Mock Orders Data
const MOCK_ORDERS = [
    { id: 101, token: '101', items: ['Veg Grilled Sandwich', 'Cold Coffee'], total: 110, slot: '12:30 - 12:45', status: 'Pending' },
    { id: 102, token: '102', items: ['Masala Dosa'], total: 80, slot: '12:30 - 12:45', status: 'Preparing' },
    { id: 103, token: '103', items: ['Chicken Biryani', 'Coke'], total: 180, slot: '12:45 - 01:00', status: 'Pending' },
    { id: 104, token: '104', items: ['Pav Bhaji'], total: 90, slot: '12:15 - 12:30', status: 'Ready' },
];

export default function AdminDashboard() {
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [filter, setFilter] = useState('All');

    const updateStatus = (id, newStatus) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kitchen Dashboard 👨‍🍳</h1>
                    <p className="text-gray-500">Manage incoming orders and pickup slots</p>
                </div>

                <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200">
                    {['All', 'Pending', 'Preparing', 'Ready', 'Collected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${filter === status ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}
              `}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map(order => (
                    <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
                ))}
            </div>
        </div>
    );
}

function OrderCard({ order, onUpdateStatus }) {
    const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Preparing': 'bg-blue-100 text-blue-800',
        'Ready': 'bg-green-100 text-green-800',
        'Collected': 'bg-gray-100 text-gray-800',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Token</span>
                    <h3 className="text-2xl font-extrabold text-primary">{order.token}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                    {order.status}
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium text-sm">Pickup: {order.slot}</span>
                </div>

                <div className="space-y-1">
                    {order.items.map((item, i) => (
                        <div key={i} className="text-gray-800 text-sm flex justify-between">
                            <span>{item}</span>
                        </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-gray-50 font-bold flex justify-between text-gray-900">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                    {order.status === 'Pending' && (
                        <button
                            onClick={() => onUpdateStatus(order.id, 'Preparing')}
                            className="col-span-2 w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <ChefHat className="w-4 h-4" /> Start Preparing
                        </button>
                    )}
                    {order.status === 'Preparing' && (
                        <button
                            onClick={() => onUpdateStatus(order.id, 'Ready')}
                            className="col-span-2 w-full py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" /> Mark Ready
                        </button>
                    )}
                    {order.status === 'Ready' && (
                        <button
                            onClick={() => onUpdateStatus(order.id, 'Collected')}
                            className="col-span-2 w-full py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-bold text-sm transition-colors"
                        >
                            Mark Collected
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
