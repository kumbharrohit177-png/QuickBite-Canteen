import React from 'react';
import { RefreshCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <RefreshCcw className="w-6 h-6 text-amber-600" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900">Refund Policy</h1>
                    </div>

                    <div className="prose prose-orange max-w-none text-gray-600">
                        <p className="lead text-lg font-medium text-gray-800 mb-6">
                            We strive to ensure you are satisfied with your meal. Here is our policy on refunds and cancellations.
                        </p>

                        <h3>1. Order Cancellation</h3>
                        <p>
                            You may cancel your order within 5 minutes of placing it, provided preparation has not explicitly begun. In such cases, a full refund will be initiated to your original payment method.
                        </p>

                        <h3>2. Refunds for Unavailable Items</h3>
                        <p>
                            If an item you ordered is unavailable, we will contact you to offer a substitute or provide a full refund for that item.
                        </p>

                        <h3>3. Quality Issues</h3>
                        <p>
                            If you are unsatisfied with the quality of your food, please contact the canteen staff immediately upon pickup. Refunds or replacements for quality issues are at the discretion of the management.
                        </p>

                        <h3>4. Refund Processing</h3>
                        <p>
                            Approved refunds are typically processed within 5-7 business days and credited back to the original source of payment.
                        </p>

                        <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-400">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
