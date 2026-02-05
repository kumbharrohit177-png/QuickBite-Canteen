import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowLeft, CheckCircle, Loader, AlertCircle, ShoppingBag } from 'lucide-react';
import TimeSlotPicker from '../components/TimeSlotPicker';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import confetti from 'canvas-confetti';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(null); // Stores order token if placed

    const handlePlaceOrder = async () => {
        if (!selectedSlot) return;
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const orderData = {
                user: user.id, // Backend will likely verify this from token too
                items: cart.map(item => ({
                    foodItem: item.id, // Assuming 'id' matches backend _id
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount: totalAmount + Math.round(totalAmount * 0.05),
                pickupSlot: selectedSlot
            };

            const res = await api.post('/orders', orderData);

            // Success!
            const newOrder = res.data;
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

        } catch (err) {
            console.error("Order Error:", err);
            setError(err.response?.data?.msg || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
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
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/menu" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 animate-fade-in">Your Cart</h1>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg flex items-center gap-3 animate-shake">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            {cart.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 animate-fade-in-up">
                    <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-12 h-12 text-primary/40" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any delicious meals yet.</p>
                    <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-lg hover:bg-orange-600 hover:scale-105 transition-all">
                        Browse Menu
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-6">
                            {cart.map((item, index) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row items-center gap-6 animate-slide-up hover:shadow-md transition-shadow" style={{ animationDelay: `${index * 50}ms` }}>
                                    {/* Product Image */}
                                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                                        <p className="text-gray-500 text-sm mb-3">₹{item.price} per item</p>

                                        <div className="inline-flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-primary transition-all font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price & Remove */}
                                    <div className="flex flex-col items-center sm:items-end gap-2">
                                        <span className="font-bold text-xl text-primary">₹{item.price * item.quantity}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Time Slot Picker Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <TimeSlotPicker selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
                        </div>
                    </div>

                    {/* Checkout Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-400"></div>
                            <h3 className="font-bold text-2xl text-gray-800 mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Tax (5%)</span>
                                    <span>₹{Math.round(totalAmount * 0.05)}</span>
                                </div>
                                <div className="border-t-2 border-dashed border-gray-100 pt-4 flex justify-between items-end">
                                    <span className="text-gray-500 font-bold">Total</span>
                                    <span className="text-3xl font-extrabold text-gray-900">₹{totalAmount + Math.round(totalAmount * 0.05)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={!selectedSlot || loading}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-xl flex items-center justify-center relative overflow-hidden group
                  ${selectedSlot && !loading
                                        ? 'bg-primary text-white hover:bg-orange-600 transform hover:-translate-y-1'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}
                `}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    selectedSlot ? (
                                        <span className="flex items-center gap-2">
                                            Place Order <CheckCircle className="w-5 h-5" />
                                        </span>
                                    ) : 'Select Time Slot'
                                )}
                            </button>

                            {!selectedSlot && (
                                <p className="text-xs text-center text-red-400 mt-3 font-medium animate-pulse">
                                    Please select a pickup time to proceed
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
