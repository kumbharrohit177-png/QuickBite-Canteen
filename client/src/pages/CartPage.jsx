import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, CheckCircle, Loader, AlertCircle, ShoppingBag, Plus, Minus, Ticket, FileText, Clock, ArrowRight, X } from 'lucide-react';
import TimeSlotPicker from '../components/TimeSlotPicker';
import PaymentModal from '../components/PaymentModal';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalAmount, clearCart, totalItems } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [instructions, setInstructions] = useState('');
    const [couponCode, setCouponCode] = useState('');

    const handleUpdateQuantity = (id, delta, currentQty) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return; // Minimum 1
        if (newQty > 10) return; // Maximum 10
        updateQuantity(id, delta);
    };

    const handleRemoveItem = (id) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            removeFromCart(id);
        }
    };

    const handleProceedToPay = () => {
        if (!selectedSlot) return;
        if (!user) {
            navigate('/login');
            return;
        }
        setIsPaymentModalOpen(true);
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleConfirmPayment = async (method) => {
        setIsPaymentModalOpen(false);
        setLoading(true);
        setError(null);

        if (method === 'cash') {
            // Cash Order logic (existing /orders route)
            try {
                const orderData = {
                    user: user.id,
                    items: cart.map(item => ({
                        foodItem: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    totalAmount: totalAmount + Math.round(totalAmount * 0.05),
                    pickupSlot: selectedSlot,
                    instructions: instructions
                };

                const res = await api.post('/orders', orderData);
                const newOrder = res.data;
                handleOrderSuccess(newOrder);

            } catch (err) {
                console.error("Order Error:", err);
                setError(err.response?.data?.msg || "Failed to place order.");
                toast.error("Failed to place order. Please try again.");
                setLoading(false);
            }
        } else {
            // Razorpay logic
            await handleRazorpayPayment();
        }
    };

    const handleRazorpayPayment = async () => {
        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order
            const amount = totalAmount + Math.round(totalAmount * 0.05);
            const result = await api.post('/payment/create-order', { amount });

            if (!result) {
                alert("Server error. Are you online?");
                toast.error("Server error. Please check your connection.");
                setLoading(false);
                return;
            }

            const { amount: orderAmount, id: order_id, currency } = result.data;

            // 2. Open Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderAmount.toString(),
                currency: currency,
                name: "QuickBite Canteen",
                description: "Campus Food Order",
                order_id: order_id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const orderData = {
                            items: cart.map(item => ({
                                foodItem: item.id,
                                name: item.name,
                                price: item.price,
                                quantity: item.quantity
                            })),
                            totalAmount: amount,
                            pickupSlot: selectedSlot,
                        };

                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData
                        });

                        if (verifyRes.data.success) {
                            handleOrderSuccess(verifyRes.data.order);
                        } else {
                            toast.error("Payment verification failed");
                            setLoading(false);
                        }
                    } catch (err) {
                        console.error("Verification Error:", err);
                        toast.error("Payment verification failed");
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: "9999999999" // Dummy or from user profile
                },
                notes: {
                    address: "Campus Canteen"
                },
                theme: {
                    color: "#F97316" // Primary Orange
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        // alert('Payment cancelled'); // Optional: notify user
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            paymentObject.on('payment.failed', function (response) {
                toast.error(response.error.description);
                setLoading(false);
            });

        } catch (err) {
            console.error("Razorpay Error:", err);
            setError("Payment failed. Please try again.");
            toast.error("Payment initialization failed.");
            setLoading(false);
        }
    };

    const handleOrderSuccess = (newOrder) => {
        setOrderPlaced({
            token: newOrder.tokenNumber,
            slot: newOrder.pickupSlot,
            items: cart,
            total: newOrder.totalAmount
        });
        clearCart();
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        toast.success("Order placed successfully! 🎉");
        setLoading(false);
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6 animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Order Confirmed!</h2>
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                        <p className="text-gray-500 text-sm uppercase tracking-wide mb-1">Your Token Number</p>
                        <p className="text-5xl font-extrabold text-primary">{orderPlaced.token}</p>
                    </div>
                    <div className="text-left space-y-2 text-gray-600 bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                            <span>Pickup Time:</span>
                            <span className="font-bold text-gray-800">{orderPlaced.slot}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Amount:</span>
                            <span className="font-bold text-gray-800">₹{orderPlaced.total}</span>
                        </div>
                    </div>
                    <Link to="/orders" className="block w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-colors">
                        View My Orders
                    </Link>
                    <Link to="/" className="block w-full text-center text-gray-500 font-medium hover:text-primary mt-2">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/menu" className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800">🛒 Your Cart</h1>
                    <p className="text-gray-500 text-sm">Review your order before checkout</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg flex items-center gap-3 animate-shake">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            {cart.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-200 animate-fade-in-up">
                    <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-primary/40" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any delicious meals yet.</p>
                    <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-lg hover:bg-orange-600 hover:scale-105 transition-all">
                        👉 Browse Menu
                    </Link>
                </div>
            ) : (
                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT SIDE (70%) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Cart Items List (Card Layout) */}
                        <div className="space-y-4">
                            {cart.map((item, index) => (
                                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 animate-slide-up hover:shadow-md transition-shadow relative group">

                                    {/* Image */}
                                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 text-center sm:text-left space-y-1">
                                        <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                        <p className="text-gray-500 font-medium">₹{item.price}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="inline-flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, -1, item.quantity)}
                                                disabled={item.quantity <= 1}
                                                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all font-bold ${item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, 1, item.quantity)}
                                                disabled={item.quantity >= 10}
                                                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all font-bold ${item.quantity >= 10 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-white hover:shadow-sm'}`}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium">Max 10</p>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right min-w-[80px]">
                                        <p className="text-xs text-gray-500 mb-1">Subtotal</p>
                                        <p className="font-bold text-xl text-primary">₹{item.price * item.quantity}</p>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="sm:static absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="Remove Item"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Clear Cart Button */}
                        {cart.length > 0 && (
                            <div className="flex justify-end">
                                <button
                                    onClick={clearCart}
                                    className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors text-sm"
                                >
                                    <Trash2 className="w-4 h-4" /> Clear Cart
                                </button>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 text-gray-800">
                                <FileText className="w-5 h-5 text-primary" />
                                <h3 className="font-bold">Add cooking instructions (optional)</h3>
                            </div>
                            <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="E.g., Less spicy, No onions"
                                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50 min-h-[100px]"
                            ></textarea>
                        </div>

                        {/* Time Slot Picker */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 text-gray-800">
                                <Clock className="w-5 h-5 text-primary" />
                                <h3 className="font-bold">Select Pickup Time</h3>
                            </div>
                            <TimeSlotPicker selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
                        </div>
                    </div>

                    {/* RIGHT SIDE (30%) - Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-24">
                            <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                                Order Summary
                            </h3>

                            {/* Breakdown */}
                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items</span>
                                    <span className="font-bold text-gray-800">{totalItems}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (5%)</span>
                                    <span className="font-medium text-gray-900">₹{Math.round(totalAmount * 0.05)}</span>
                                </div>
                                {couponCode && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-medium">- ₹0</span>
                                    </div>
                                )}
                            </div>

                            {/* Coupon (Simplified) */}
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Coupon Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            {/* Final Total */}
                            <div className="flex justify-between items-center mb-8 pt-4 border-t border-dashed border-gray-200">
                                <span className="text-gray-600 font-bold uppercase tracking-wide">Total</span>
                                <span className="text-3xl font-extrabold text-primary">₹{totalAmount + Math.round(totalAmount * 0.05)}</span>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleProceedToPay}
                                    disabled={!selectedSlot || loading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95
                                        ${selectedSlot && !loading
                                            ? 'bg-primary text-white hover:bg-orange-600'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                                    `}
                                >
                                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Proceed to Checkout'}
                                </button>

                                <Link to="/menu" className="block w-full py-3 text-center text-gray-500 font-bold border-2 border-gray-100 rounded-xl hover:border-gray-300 hover:text-gray-700 transition-colors">
                                    Continue Shopping
                                </Link>
                            </div>

                            <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-100 flex gap-2 items-start">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-600 leading-relaxed">
                                    <span className="font-bold">Cancellation Policy:</span> Help us reduce food waste by avoiding cancellations after placing your order. A 100% cancellation fee will be applied.
                                </p>
                            </div>

                            {!selectedSlot && (
                                <p className="text-xs text-center text-red-500 mt-4 bg-red-50 py-2 rounded-lg">
                                    ⚠️ Please select pickup time
                                </p>
                            )}
                            {!user && (
                                <p className="text-xs text-center text-red-500 mt-2">
                                    ⚠️ Login required to checkout
                                </p>
                            )}

                        </div>
                    </div>
                </div>
            )}

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onConfirm={handleConfirmPayment}
                totalAmount={totalAmount + Math.round(totalAmount * 0.05)}
            />
        </div>
    );
}
