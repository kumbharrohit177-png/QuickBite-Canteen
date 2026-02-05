import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Clock, CheckCircle, Utensils, AlertCircle, Loader, ChefHat, Package, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my-orders');
                setOrders(res.data);
            } catch (err) {
                console.error("Fetch Orders Error:", err);
                setError("Failed to load your orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-gray-50/50 min-h-screen">
            <div className="flex items-end justify-between mb-12 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
                    <p className="text-gray-500 mt-2 text-lg">Track your current and past meals</p>
                </div>
                <Link to="/menu" className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-primary/30 hover:text-primary transition-all shadow-sm order-new-btn">
                    <Utensils className="w-5 h-5" />
                    Order New Meal
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-8 flex items-center gap-3 animate-shake">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
                    <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-primary/40" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No active orders</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Hungry?</p>
                    <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-lg hover:bg-orange-600 hover:scale-105 transition-all">
                        Browse Menu
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order, index) => (
                        <OrderCard key={order._id} order={order} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}


function OrderCard({ order, index }) {
    const steps = ['Pending', 'Preparing', 'Ready', 'Collected'];
    // Handle unknown status gracefully
    const status = steps.includes(order.status) ? order.status : 'Pending';
    const currentStepIndex = steps.indexOf(status);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-blue-600 bg-blue-50';
            case 'Preparing': return 'text-amber-600 bg-amber-50';
            case 'Ready': return 'text-emerald-600 bg-emerald-50';
            case 'Collected': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300 animate-slide-up group" style={{ animationDelay: `${index * 100}ms` }}>

            {/* Left: Token & Status (Ticket Stub style) */}
            <div className={`md:w-1/3 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-dashed border-gray-200 relative bg-gradient-to-br from-gray-50 to-white`}>
                {/* Semi-circles for ticket effect - polished */}
                <div className="absolute -top-3 md:-top-3 md:-right-3 w-6 h-6 bg-white border border-gray-100 rounded-full shadow-inner"></div>
                <div className="absolute -bottom-3 md:-bottom-3 md:-right-3 w-6 h-6 bg-white border border-gray-100 rounded-full shadow-inner"></div>

                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">Token Number</p>
                <div className="bg-white px-8 py-4 rounded-2xl shadow-sm border border-gray-100 mb-4 transform group-hover:scale-105 transition-transform">
                    <h2 className="text-6xl font-black text-gray-900 tracking-tighter">{order.tokenNumber}</h2>
                </div>

                <div className={`mt-2 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 uppercase tracking-wide border ${getStatusColor(order.status).replace('bg-', 'border-').replace('text-', 'text-')}`}>
                    <StatusIcon status={order.status} />
                    {order.status}
                </div>
            </div>

            {/* Right: Details & Tracker */}
            <div className="flex-grow p-8">
                {/* Tracker */}
                <div className="mb-10 relative mt-4">
                    <div className="absolute top-1/2 left-0 w-full h-1.5 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-primary/20 w-full"></div>
                    </div>
                    <div className="absolute top-1/2 left-0 h-1.5 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,107,0,0.5)]" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>
                    <div className="relative flex justify-between">
                        {steps.map((step, i) => (
                            <div key={step} className="flex flex-col items-center gap-3 relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-4 transition-all duration-500 bg-white shadow-sm
                                    ${i <= currentStepIndex
                                        ? 'border-primary text-primary scale-110 shadow-md'
                                        : 'border-gray-100 text-gray-300'}
                                `}>
                                    {i < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                                </div>
                                <span className={`text-[10px] uppercase font-bold tracking-widest transition-colors duration-300 ${i <= currentStepIndex ? 'text-gray-900' : 'text-gray-300'}`}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-8 p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Details</h4>
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-gray-800">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-white border border-gray-200 text-xs font-bold text-gray-500 shadow-sm">
                                    {item.quantity}
                                </span>
                                <span className="font-semibold text-lg">{item.foodItem?.name || item.name || 'Unknown Item'}</span>
                            </div>
                            <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-3 text-gray-500 bg-orange-50/50 px-4 py-2 rounded-xl border border-orange-100/50">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-medium text-sm">Pickup at <span className="text-gray-900 font-bold ml-1 text-lg">{order.pickupSlot}</span></span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Paid</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tight">₹{order.totalAmount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusIcon({ status }) {
    switch (status) {
        case 'Preparing': return <ChefHat className="w-4 h-4" />;
        case 'Ready': return <Package className="w-4 h-4" />;
        case 'Collected': return <CheckCircle className="w-4 h-4" />;
        default: return <Clock className="w-4 h-4" />;
    }
}
