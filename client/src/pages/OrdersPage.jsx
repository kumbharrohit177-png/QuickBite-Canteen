import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import {
    Clock, CheckCircle, Utensils, AlertCircle, Loader, ChefHat,
    Package, ShoppingBag, Search, XCircle, RotateCcw, Filter, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Derived state for stats
    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => ['Pending', 'Preparing', 'Ready'].includes(o.status)).length;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my-orders');
                setOrders(res.data);
                setFilteredOrders(res.data);
            } catch (err) {
                console.error("Fetch Orders Error:", err);
                setError("Failed to load your orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = orders;

        // 1. Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(order =>
                order.tokenNumber.toLowerCase().includes(term) ||
                order._id.toLowerCase().includes(term)
            );
        }

        // 2. Category Filter
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        switch (activeFilter) {
            case 'Today':
                result = result.filter(o => new Date(o.createdAt) >= startOfDay);
                break;
            case 'This Week':
                result = result.filter(o => new Date(o.createdAt) >= startOfWeek);
                break;
            case 'This Month':
                result = result.filter(o => new Date(o.createdAt) >= startOfMonth);
                break;
            case 'Pending':
                result = result.filter(o => ['Pending', 'Preparing'].includes(o.status));
                break;
            default:
                break;
        }

        setFilteredOrders(result);
    }, [searchTerm, activeFilter, orders]);

    const handleOrderUpdate = (updatedOrder) => {
        setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-50/50 min-h-screen font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Orders</h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        You have <span className="text-primary font-bold">{activeOrders} active</span> orders
                    </p>
                </div>
                <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:translate-y-[-2px]">
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

            {/* Filters & Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-10 backdrop-blur-md bg-white/90">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                    {['All', 'Pending', 'Today', 'This Week', 'This Month'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all
                                ${activeFilter === filter
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Token..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-sm"
                    />
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
                    <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Try changing your filters or place a new order to get started.</p>
                    {activeFilter !== 'All' && (
                        <button
                            onClick={() => setActiveFilter('All')}
                            className="text-primary font-bold hover:underline"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order, index) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            index={index}
                            onUpdate={handleOrderUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function OrderCard({ order, index, onUpdate }) {
    const { addMultipleToCart } = useCart();
    const [expanded, setExpanded] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const steps = ['Pending', 'Preparing', 'Ready', 'Collected'];
    // Handle cancelled status specially
    const isCancelled = order.status === 'Cancelled';
    const status = (steps.includes(order.status) || isCancelled) ? order.status : 'Pending';
    const currentStepIndex = steps.indexOf(status);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'Preparing': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'Ready': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'Collected': return 'text-gray-600 bg-gray-50 border-gray-100';
            case 'Cancelled': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        setActionLoading(true);
        try {
            const res = await api.put(`/orders/${order._id}/cancel`);
            onUpdate(res.data);
            toast.success("Order cancelled successfully");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to cancel order");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReorder = () => {
        const itemsToReorder = order.items.map(item => ({
            id: item.foodItem?._id || item._id, // Handle populated vs raw structure
            name: item.foodItem?.name || item.name,
            price: item.foodItem?.price || item.price,
            image: item.foodItem?.image || item.image,
            category: item.foodItem?.category || 'General',
            quantity: item.quantity
        }));

        addMultipleToCart(itemsToReorder);
        toast.success("Items added to cart! 🛒");
    };

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md ${isCancelled ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            {/* Card Header - Always Visible */}
            <div className="p-6 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                    {/* Left: ID & Date */}
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 w-16 h-16 rounded-xl flex flex-col items-center justify-center border border-gray-200">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Token</span>
                            <span className="text-2xl font-black text-gray-900">{order.tokenNumber}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                    <StatusIcon status={order.status} />
                                    {order.status}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Right: Total & Action */}
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                            <p className="text-xl font-black text-gray-900">₹{order.totalAmount}</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                    </div>
                </div>


            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="bg-gray-50/50 border-t border-gray-100 p-6 animate-fade-in-down">
                    {!isCancelled && (
                        <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Live Status</h4>
                            <LiveStatusTimeline currentStatus={order.status} createdAt={order.createdAt} />
                        </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Items Ordered</h4>
                            <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-500">{item.quantity}x</span>
                                            <span className="font-medium text-gray-800">{item.foodItem?.name || item.name || 'Unknown Item'}</span>
                                        </div>
                                        <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="font-bold text-gray-900">Grand Total</span>
                                <span className="font-black text-xl text-primary">₹{order.totalAmount}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Info</h4>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">Pickup Slot: <span className="text-gray-900 font-bold">{order.pickupSlot}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="font-medium">Payment: <span className="text-green-600 font-bold">Paid Online</span></span>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    {order.status === 'Pending' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                                            disabled={actionLoading}
                                            className="flex-1 bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2"
                                        >
                                            {actionLoading ? <Loader className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                            Cancel Order
                                        </button>
                                    )}

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleReorder(); }}
                                        className="flex-1 bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reorder
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusIcon({ status }) {
    switch (status) {
        case 'Preparing': return <ChefHat className="w-3 h-3" />;
        case 'Ready': return <Package className="w-3 h-3" />;
        case 'Collected': return <CheckCircle className="w-3 h-3" />;
        case 'Cancelled': return <XCircle className="w-3 h-3" />;
        default: return <Clock className="w-3 h-3" />;
    }
}

function LiveStatusTimeline({ currentStatus, createdAt }) {
    const steps = [
        { status: 'Pending', label: 'Order Received', desc: "We've received your order." },
        { status: 'Preparing', label: 'Preparing', desc: "Chef is working on your meal." },
        { status: 'Ready', label: 'Ready for Pickup', desc: "Show your Student ID to collect." },
        { status: 'Collected', label: 'Collected', desc: "Enjoy your meal!" }
    ];

    const currentStepIndex = steps.findIndex(s => s.status === currentStatus);
    const date = new Date(createdAt);

    return (
        <div className="relative pl-4 space-y-8 before:absolute before:inset-0 before:left-2 before:h-full before:w-0.5 before:bg-gray-100">
            {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                    <div key={step.status} className="relative flex items-start gap-4">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[29px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-all duration-500
                            ${isCompleted ? 'border-primary bg-primary text-white' : 'border-gray-200 text-gray-300'}
                            ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}
                        `}>
                            {isCompleted ? <CheckCircle className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 transition-all duration-500 ${isCompleted ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h5 className={`font-bold text-sm ${isCurrent ? 'text-primary text-lg' : 'text-gray-900'}`}>
                                        {step.label}
                                    </h5>
                                    <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                                </div>
                                {index === 0 && (
                                    <span className="text-xs font-mono text-gray-400">
                                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                                {isCurrent && index !== 0 && (
                                    <span className="text-xs font-bold text-primary animate-pulse">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
