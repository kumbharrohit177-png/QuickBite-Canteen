import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        itemName: '',
        quantity: 0,
        unit: 'kg',
        lowStockThreshold: 5
    });

    const fetchInventory = async () => {
        try {
            const res = await api.get('/admin/inventory');
            if (res.data.success) {
                setItems(res.data.inventory);
            }
        } catch (error) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({ itemName: '', quantity: 0, unit: 'kg', lowStockThreshold: 5 });
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData(item);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/admin/inventory/${editingItem._id}`, formData);
                toast.success('Inventory updated');
            } else {
                await api.post('/admin/inventory', formData);
                toast.success('Raw material added');
            }
            setIsModalOpen(false);
            fetchInventory();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this raw material?')) {
            try {
                await api.delete(`/admin/inventory/${id}`);
                toast.success('Material deleted');
                fetchInventory();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    // Quick quantity update buttons
    const adjustQuantity = async (item, amount) => {
        const newTotal = Number(item.quantity) + amount;
        if (newTotal < 0) return;

        try {
            await api.put(`/admin/inventory/${item._id}`, { ...item, quantity: newTotal });
            setItems(items.map(i => i._id === item._id ? { ...i, quantity: newTotal } : i));
            // Only toast if it drops below threshold
            if (newTotal <= item.lowStockThreshold && item.quantity > item.lowStockThreshold) {
                toast.error(`${item.itemName} is now LOW STOCK!`);
            }
        } catch (error) {
            toast.error('Failed to update quantity');
        }
    };

    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockItems = items.filter(item => item.quantity <= item.lowStockThreshold);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Track raw materials and get low-stock alerts.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all font-medium"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Material
                </button>
            </div>

            {lowStockItems.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                    <div>
                        <h3 className="text-red-800 font-bold">Low Stock Alert!</h3>
                        <p className="text-red-700 text-sm mt-1">
                            The following items need to be restocked:
                            <span className="font-semibold ml-1">
                                {lowStockItems.map(i => i.itemName).join(', ')}
                            </span>
                        </p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-72">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search materials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quick Update</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center">Loading inventory...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No raw materials found.</td></tr>
                            ) : (
                                filteredItems.map((item) => {
                                    const isLow = item.quantity <= item.lowStockThreshold;
                                    return (
                                        <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-bold text-gray-900">{item.itemName}</div>
                                                <div className="text-xs text-gray-500">Last updated: {new Date(item.lastUpdated).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`flex items-center font-bold text-lg ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {item.quantity} <span className="text-sm font-medium text-gray-500 ml-1">{item.unit}</span>
                                                    {isLow && <ExclamationTriangleIcon className="h-5 w-5 text-red-500 ml-2 animate-pulse" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.lowStockThreshold} {item.unit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
                                                    <button onClick={() => adjustQuantity(item, -1)} className="px-3 text-gray-500 hover:text-red-600 font-bold text-lg">-</button>
                                                    <div className="w-px bg-gray-200 mx-1"></div>
                                                    <button onClick={() => adjustQuantity(item, 1)} className="px-3 text-gray-500 hover:text-green-600 font-bold text-lg">+</button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingItem ? 'Edit Material' : 'Add Material'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
                                <input required type="text" name="itemName" value={formData.itemName} onChange={handleInputChange} placeholder="e.g. Tomatoes, Flour" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                                    <input required type="number" step="0.1" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                    <select required name="unit" value={formData.unit} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white">
                                        <option value="kg">kg</option>
                                        <option value="g">g</option>
                                        <option value="L">Liters (L)</option>
                                        <option value="ml">ml</option>
                                        <option value="pcs">Pieces (pcs)</option>
                                        <option value="pkts">Packets</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert Threshold</label>
                                <input required type="number" step="0.1" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                                <p className="text-xs text-gray-500 mt-1">You will be alerted when stock falls below this number.</p>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">Cancel</button>
                                <button type="submit" className="px-5 py-2 text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:shadow-lg transition-all font-medium">
                                    {editingItem ? 'Save' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
