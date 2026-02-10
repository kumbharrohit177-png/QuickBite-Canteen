import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 animate-fade-in-up">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900">Terms & Conditions</h1>
                    </div>

                    <div className="prose prose-orange max-w-none text-gray-600">
                        <p className="lead text-lg font-medium text-gray-800 mb-6">
                            Welcome to QuickBite. By accessing or using our website, you agree to be bound by these terms.
                        </p>

                        <h3>1. Use of Service</h3>
                        <p>
                            QuickBite provides a pre-ordering platform for canteen services. You agree to use the service only for lawful purposes and in accordance with these Terms.
                        </p>

                        <h3>2. User Accounts</h3>
                        <p>
                            To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                        </p>

                        <h3>3. Ordering & Payments</h3>
                        <p>
                            All orders are subject to availability. Prices are subject to change without notice. Payment must be made at the time of ordering via the available payment methods.
                        </p>

                        <h3>4. Limitation of Liability</h3>
                        <p>
                            QuickBite shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the service.
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
