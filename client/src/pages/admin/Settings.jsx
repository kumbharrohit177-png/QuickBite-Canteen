import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
    ClockIcon,
    AtSymbolIcon,
    PhoneIcon,
    ReceiptPercentIcon,
    Cog8ToothIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
    const [settings, setSettings] = useState({
        canteenName: 'QuickBite Canteen',
        openingTime: '08:00 AM',
        closingTime: '06:00 PM',
        taxPercentage: 5,
        contactEmail: 'admin@quickbite.com',
        contactPhone: '+91 9876543210',
        deliveryRules: 'Pickup only at the counter.',
        isOpen: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/admin/settings');
                if (res.data.success && res.data.settings) {
                    setSettings(res.data.settings);
                }
            } catch (error) {
                toast.error('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/admin/settings', settings);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Canteen Configuration</h1>
                <p className="text-gray-500 text-sm mt-1">Manage global timings, tax rates, and contact info.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSave}>

                    {/* Primary Status Toggle */}
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Cog8ToothIcon className="h-5 w-5 text-gray-500" /> Operational Status
                            </h2>
                            <p className="text-sm text-gray-500">Toggle whether the canteen is currently accepting orders.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isOpen"
                                checked={settings.isOpen}
                                onChange={async (e) => {
                                    const newValue = e.target.checked;
                                    setSettings(prev => ({ ...prev, isOpen: newValue }));
                                    try {
                                        await api.put('/admin/settings', { ...settings, isOpen: newValue });
                                        toast.success(`Canteen is now ${newValue ? 'Accepting Orders' : 'Closed'}`);
                                    } catch (error) {
                                        toast.error('Failed to update status');
                                        setSettings(prev => ({ ...prev, isOpen: !newValue })); // Revert on failure
                                    }
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                            <span className={`ml-3 text-sm font-bold ${settings.isOpen ? 'text-green-600' : 'text-gray-500'}`}>
                                {settings.isOpen ? 'ACCEPTING ORDERS' : 'CLOSED'}
                            </span>
                        </label>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* Timings */}
                        <div>
                            <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <ClockIcon className="h-5 w-5 text-orange-500" /> Operational Hours
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                                    <input
                                        type="time"
                                        name="openingTime"
                                        value={settings.openingTime}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                                    <input
                                        type="time"
                                        name="closingTime"
                                        value={settings.closingTime}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Financials & Rules */}
                        <div>
                            <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <ReceiptPercentIcon className="h-5 w-5 text-orange-500" /> Financials & Rules
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GST / Tax Percentage (%)</label>
                                    <input
                                        type="number"
                                        name="taxPercentage"
                                        value={settings.taxPercentage}
                                        onChange={handleChange}
                                        step="0.1"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Policy</label>
                                    <input
                                        type="text"
                                        name="deliveryRules"
                                        value={settings.deliveryRules}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                <AtSymbolIcon className="h-5 w-5 text-orange-500" /> Contact Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                    <div className="relative">
                                        <AtSymbolIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={settings.contactEmail}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Helpdesk Phone</label>
                                    <div className="relative">
                                        <PhoneIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="contactPhone"
                                            value={settings.contactPhone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                            {saving ? 'Saving...' : <><CheckBadgeIcon className="h-6 w-6" /> Save Configuration</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
