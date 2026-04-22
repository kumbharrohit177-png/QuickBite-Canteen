import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function Menu() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStock, setFilterStock] = useState('All');
    const [filterType, setFilterType] = useState('All');

    // Modal state for Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Snacks',
        price: '',
        description: '',
        image: '',
        imageFile: null,
        available: true,
        isVeg: true
    });

    const fetchMenu = async () => {
        try {
            const res = await api.get('/menu/all');
            setItems(res.data);
        } catch (error) {
            toast.error('Failed to load menu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({ name: '', category: 'Snacks', price: '', description: '', image: '', imageFile: null, available: true, isVeg: true });
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({ ...item, imageFile: null });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category', formData.category);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('available', formData.available);
            data.append('isVeg', formData.isVeg);

            if (formData.imageFile) {
                data.append('imageFile', formData.imageFile);
            } else if (formData.image) {
                data.append('image', formData.image);
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editingItem) {
                await api.put(`/menu/${editingItem._id}`, data, config);
                toast.success('Item updated');
            } else {
                await api.post('/menu', data, config);
                toast.success('Item added');
            }
            setIsModalOpen(false);
            fetchMenu();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/menu/${id}`);
                toast.success('Item deleted');
                fetchMenu();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const toggleAvailability = async (item) => {
        try {
            await api.put(`/menu/${item._id}`, { ...item, available: !item.available });
            setItems(items.map(i => i._id === item._id ? { ...i, available: !i.available } : i));
            toast.success(`${item.name} is now ${!item.available ? 'Available' : 'Out of Stock'}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const categories = [...new Set(items.map(i => i.category))];
    if (!categories.includes('Snacks')) categories.push('Snacks');
    if (!categories.includes('Meals')) categories.push('Meals');
    if (!categories.includes('Drinks')) categories.push('Drinks');

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        const matchesStock = filterStock === 'All' ? true : filterStock === 'In Stock' ? item.available : !item.available;
        const matchesType = filterType === 'All' ? true : filterType === 'Veg' ? item.isVeg : !item.isVeg;
        
        return matchesSearch && matchesCategory && matchesStock && matchesType;
    });

    return (
        <div className="space-y-6 animate-fade-in relative">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Menu Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Add, edit, and organize your food items.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all font-medium"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add New Item
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                <div className="flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Search dishes or categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full outline-none text-gray-700 bg-transparent"
                    />
                </div>
                
                {/* Advanced Filters */}
                <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-50 flex-col sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-sm text-gray-500 font-medium">Category:</span>
                        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                            {['All', ...categories].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${filterCategory === cat ? 'bg-orange-100 text-orange-700 font-medium border border-orange-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto sm:border-l sm:border-gray-200 sm:pl-4">
                        <select
                            value={filterStock}
                            onChange={(e) => setFilterStock(e.target.value)}
                            className="py-1 pl-2 pr-6 text-sm border border-gray-200 bg-gray-50 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-600 outline-none cursor-pointer"
                        >
                            <option value="All">All Stock Status</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="py-1 pl-2 pr-6 text-sm border border-gray-200 bg-gray-50 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-600 outline-none cursor-pointer"
                        >
                            <option value="All">All Types</option>
                            <option value="Veg">Vegetarian</option>
                            <option value="Non-Veg">Non-Veg</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">Loading menu...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                            <div className="h-48 relative overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                    src={item.image || 'https://via.placeholder.com/300?text=No+Image'}
                                    alt={item.name}
                                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!item.available && 'grayscale opacity-50'}`}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Image+Error' }}
                                />
                                <div className="absolute top-3 inset-x-3 flex justify-between items-start">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-lg shadow-sm ${item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                                    </span>
                                    <span className="px-2 py-1 text-xs font-bold rounded-lg shadow-sm bg-white/90 text-gray-800 backdrop-blur-sm">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                    <span className="text-lg font-extrabold text-orange-600">₹{item.price}</span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{item.description}</p>

                                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                                    <button
                                        onClick={() => toggleAvailability(item)}
                                        className={`flex items-center gap-1.5 text-sm font-medium ${item.available ? 'text-green-600 hover:text-green-700' : 'text-red-500 hover:text-red-600'}`}
                                    >
                                        {item.available ? <CheckCircleIcon className="h-5 w-5" /> : <XCircleIcon className="h-5 w-5" />}
                                        {item.available ? 'Available' : 'Out of Stock'}
                                    </button>

                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingItem ? 'Edit Menu Item' : 'Add New Item'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white">
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (Optional)</label>
                                <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" />
                                {formData.image && typeof formData.image === 'string' && !formData.image.startsWith('blob:') && (
                                    <p className="text-xs text-gray-500 mt-1 truncate">Current: {formData.image}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"></textarea>
                            </div>

                            <div className="flex gap-6 py-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleInputChange} className="rounded text-orange-500 focus:ring-orange-500" />
                                    <span className="text-sm font-medium text-gray-700">Vegetarian</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="available" checked={formData.available} onChange={handleInputChange} className="rounded text-orange-500 focus:ring-orange-500" />
                                    <span className="text-sm font-medium text-gray-700">Currently Available</span>
                                </label>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">Cancel</button>
                                <button type="submit" className="px-5 py-2 text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:shadow-lg transition-all font-medium">
                                    {editingItem ? 'Save Changes' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
