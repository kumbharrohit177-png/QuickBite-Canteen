import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Banknote, Loader, CheckCircle, X } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, onConfirm, totalAmount }) {
    const [paymentMethod, setPaymentMethod] = useState('online');

    if (!isOpen) return null;

    const handlePay = () => {
        // Pass the method back to parent (cart)
        const method = paymentMethod === 'cash' ? 'cash' : 'online';
        onConfirm(method);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-scale-in">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">
                        Select Payment Method
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-4">
                            <p className="text-sm text-gray-600 mb-1">Total Amount to Pay</p>
                            <p className="text-3xl font-extrabold text-primary">₹{totalAmount}</p>
                        </div>

                        <div className="space-y-3">
                            <PaymentOption
                                id="online"
                                label="Pay Online (Razorpay)"
                                subLabel="UPI, Cards, Netbanking"
                                icons={[
                                    "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg",
                                    "https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png",
                                    "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg",
                                    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                                ]}
                                selected={paymentMethod}
                                onSelect={setPaymentMethod}
                            />
                            <PaymentOption
                                id="cash"
                                label="Cash"
                                subLabel="Pay at Counter"
                                icons={[]}
                                customIcon={<Banknote className="w-6 h-6 text-green-600" />}
                                selected={paymentMethod}
                                onSelect={setPaymentMethod}
                            />
                        </div>

                        {paymentMethod === 'online' && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-500 text-center animate-fade-in">
                                You will be redirected to Razorpay secure checkout.
                            </div>
                        )}

                        <button
                            onClick={handlePay}
                            className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {paymentMethod === 'online' ? 'Proceed to Pay' : 'Confirm Cash Order'} ₹{totalAmount}
                        </button>

                        <div className="text-center mt-4">
                            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Secured by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentOption({ id, icons, customIcon, label, subLabel, selected, onSelect }) {
    return (
        <label
            className={`
                flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50
                ${selected === id ? 'border-primary bg-primary/5' : 'border-gray-100'}
            `}
            onClick={() => onSelect(id)}
        >
            <div className="flex gap-2">
                {customIcon ? (
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        {customIcon}
                    </div>
                ) : (
                    icons.map((icon, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm p-2 overflow-hidden">
                            <img src={icon} alt="" className="w-full h-full object-contain" />
                        </div>
                    ))
                )}
            </div>

            <div className="flex-grow">
                <p className="font-bold text-gray-800">{label}</p>
                <p className="text-xs text-gray-500 font-medium">{subLabel}</p>
            </div>

            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === id ? 'border-primary' : 'border-gray-300'}`}>
                {selected === id && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
            </div>
        </label>
    );
}
