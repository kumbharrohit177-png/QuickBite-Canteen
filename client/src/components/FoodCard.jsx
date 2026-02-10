import { Plus, Minus, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function FoodCard({ item, index }) {
    const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

    const itemId = item._id || item.id;
    const cartItem = cart.find(cartItem => cartItem.id === itemId);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAdd = () => {
        addToCart(item);
        toast.success(`${item.name} added to cart! 🛒`);
    };

    const handleIncrement = () => {
        updateQuantity(itemId, 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(itemId, -1);
        } else {
            removeFromCart(itemId);
        }
    };

    return (
        <div
            className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover:translate-y-[-4px]"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-800 shadow-sm">
                        {item.category}
                    </span>
                </div>

                <div className="absolute top-4 right-4">
                    <div className={`w-6 h-6 rounded-md ${item.isVeg ? 'border-green-500' : 'border-red-500'} border-2 flex items-center justify-center bg-white shadow-sm`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                </div>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 left-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-white" />
                        <span className="text-white text-xs font-bold">~15 min</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow relative">
                <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                            {item.name}
                        </h3>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">
                        {item.description}
                    </p>
                </div>

                <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Price</span>
                        <span className="text-2xl font-black text-gray-900">₹{item.price}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        {/* Availability Status Text */}
                        {item.available ? (
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                Available
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 mb-1">
                                Unavailable
                            </span>
                        )}

                        {!quantity ? (
                            <button
                                onClick={handleAdd}
                                disabled={!item.available}
                                className={`
                                    relative overflow-hidden h-10 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/20
                                    ${item.available
                                        ? 'bg-primary text-white hover:bg-primary-hover hover:scale-105 active:scale-95'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}
                                `}
                            >
                                {item.available ? (
                                    <>
                                        <span>ADD</span>
                                        <Plus className="w-4 h-4" />
                                    </>
                                ) : (
                                    <span>Sold Out</span>
                                )}
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 bg-primary text-white rounded-xl px-2 py-1 shadow-lg shadow-primary/30 animate-fade-in">
                                <button
                                    onClick={handleDecrement}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/10 active:scale-90 transition-all font-bold"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                                <button
                                    onClick={handleIncrement}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/10 active:scale-90 transition-all font-bold"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
