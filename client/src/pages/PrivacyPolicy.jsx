import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900">Privacy Policy</h1>
                    </div>

                    <div className="prose prose-orange max-w-none text-gray-600">
                        <p className="lead text-lg font-medium text-gray-800 mb-6">
                            At QuickBite, we take your privacy seriously. This policy describes how we collect, use, and handle your information.
                        </p>

                        <h3>1. Information We Collect</h3>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, place an order, or communicate with us. This may include your name, email address, phone number, and payment information.
                        </p>

                        <h3>2. How We Use Your Information</h3>
                        <p>
                            We use the information we collect to:
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                                <li>Process your orders and payments.</li>
                                <li>Communicate with you about your orders and account.</li>
                                <li>Improve our services and user experience.</li>
                                <li>Send you promotional offers (only if you opt-in).</li>
                            </ul>
                        </p>

                        <h3>3. Data Security</h3>
                        <p>
                            We implement a variety of security measures to maintain the safety of your personal information. Your payment information is processed securely by our payment partners (Razorpay) and is never stored on our servers.
                        </p>

                        <h3>4. Cookies</h3>
                        <p>
                            We use cookies to enhance your experience. You can choose to disable cookies through your browser settings, but this may affect the functionality of our website.
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
