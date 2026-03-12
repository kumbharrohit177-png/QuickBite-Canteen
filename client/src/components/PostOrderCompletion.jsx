import React, { useState } from 'react';
import { Star, Download, Heart, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PostOrderCompletion({ order }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const handleRatingSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a star rating first");
            return;
        }
        setIsSubmitting(true);
        // Simulate API call for submitting review
        setTimeout(() => {
            toast.success("Thank you for your review!");
            setIsSubmitting(false);
            setRating(0);
            setReviewText('');
        }, 1000);
    };

    const toggleFavorite = (itemId) => {
        setFavorites(prev => {
            const isFav = prev.includes(itemId);
            if (isFav) {
                toast("Removed from favorites", { icon: "💔" });
                return prev.filter(id => id !== itemId);
            } else {
                toast.success("Added to favorites!", { icon: "❤️" });
                return [...prev, itemId];
            }
        });
    };

    const handleDownloadReceipt = () => {
        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(22);
            doc.setTextColor(40);
            doc.text("QuickBite Canteen", 14, 22);

            doc.setFontSize(14);
            doc.text("Order Receipt", 14, 30);

            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Order ID: #${order._id.slice(-6).toUpperCase()}`, 14, 40);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 46);
            doc.text(`Payment: ${order.paymentStatus === 'Paid' ? 'Online / Razorpay' : 'Cash at Counter'}`, 14, 52);

            // Table
            const tableColumn = ["Item Description", "Qty", "Total Price"];
            const tableRows = [];

            order.items.forEach(item => {
                const itemData = [
                    item.foodItem?.name || item.name || 'Unknown Item',
                    item.quantity.toString(),
                    `Rs. ${item.price * item.quantity}`
                ];
                tableRows.push(itemData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 60,
                theme: 'striped',
                headStyles: { fillColor: [249, 115, 22] } // Orange primary color
            });

            // Total
            const finalY = doc.lastAutoTable.finalY || 60;
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text(`Total Amount Paid: Rs. ${order.totalAmount}`, 14, finalY + 15);

            // Generate Filename and Save
            const fileName = `QuickBite_Receipt_${order.tokenNumber || order._id.slice(-4)}.pdf`;
            doc.save(fileName);
            toast.success("Receipt downloaded successfully!");
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Failed to generate receipt PDF.");
        }
    };

    return (
        <div className="mt-6 space-y-6 animate-fade-in">
            {/* Success Banner */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    <Receipt className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Completed Successfully!</h3>
                <p className="text-gray-600">We hope you enjoy your meal. Please take a moment to rate your experience.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column: Order Summary & Favorites */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Receipt className="w-5 h-5 text-gray-400" />
                        Order Summary
                    </h4>

                    <div className="space-y-4 flex-1">
                        {/* Order Meta */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-4 rounded-xl">
                            <div>
                                <p className="font-medium">Order ID</p>
                                <p className="text-gray-900 font-bold">#{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="font-medium">Date</p>
                                <p className="text-gray-900 font-bold">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="font-medium">Total Amount</p>
                                <p className="text-gray-900 font-bold">₹{order.totalAmount}</p>
                            </div>
                            <div>
                                <p className="font-medium">Payment</p>
                                <p className="text-emerald-600 font-bold">{order.paymentStatus === 'Paid' ? 'Online / Razorpay' : 'Cash at Counter'}</p>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items Ordered</p>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center group p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleFavorite(item.foodItem?._id || idx)}
                                            className={`p-1.5 rounded-full transition-all ${favorites.includes(item.foodItem?._id || idx) ? 'bg-red-50 text-red-500' : 'text-gray-300 hover:text-red-400 hover:bg-red-50/50'}`}
                                            title="Add to Favorites"
                                        >
                                            <Heart className={`w-4 h-4 ${favorites.includes(item.foodItem?._id || idx) ? 'fill-current' : ''}`} />
                                        </button>
                                        <span className="font-bold text-gray-500">{item.quantity}x</span>
                                        <span className="font-medium text-gray-800">{item.foodItem?.name || item.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleDownloadReceipt}
                        className="w-full mt-6 py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        Download Receipt
                    </button>
                </div>

                {/* Right Column: Review System */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Star className="w-5 h-5 text-gray-400" />
                        Rate Your Order
                    </h4>

                    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                        {/* Interactive Stars */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className={`transition-all duration-200 transform hover:scale-110 ${star <= (hoverRating || rating)
                                        ? 'text-yellow-400 drop-shadow-sm'
                                        : 'text-gray-200'
                                        }`}
                                >
                                    <Star className="w-10 h-10 fill-current" />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            {rating === 0 ? "Tap a star to rate" :
                                rating === 5 ? "Excellent! Loved it." :
                                    rating === 4 ? "Good food." :
                                        rating === 3 ? "It was okay." :
                                            rating === 2 ? "Didn't meet expectations." :
                                                "Horrible experience."}
                        </p>

                        <div className="w-full">
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Tell us what you liked (or didn't like) about your order..."
                                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50/50 resize-none min-h-[120px] text-sm"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        onClick={handleRatingSubmit}
                        disabled={isSubmitting}
                        className="w-full mt-6 py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}
