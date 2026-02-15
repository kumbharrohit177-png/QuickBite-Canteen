import { useState, useEffect, useRef } from 'react';
import FoodCard from '../components/FoodCard';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Search, Filter, X, ChevronRight, ChevronLeft, Sparkles, Loader, Leaf, Drumstick } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['All', 'Snacks', 'Lunch', 'South Indian', 'Beverages', 'Chinese', 'Continental', 'Desserts'];

export default function MenuPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [onlyVeg, setOnlyVeg] = useState(false);
    const [onlyNonVeg, setOnlyNonVeg] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('recommended');
    const [priceRange, setPriceRange] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { totalItems, totalAmount } = useCart();

    const categoryScrollRef = useRef(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await api.get('/menu');
                setMenuItems(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch menu:", err);
                setError("Failed to load menu. Please make sure server is running.");
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesVeg = !onlyVeg || item.isVeg;
        const matchesNonVeg = !onlyNonVeg || !item.isVeg;
        const matchesAvailability = item.available !== false;

        // Price Filter
        let matchesPrice = true;
        if (priceRange === 'under100') matchesPrice = item.price < 100;
        else if (priceRange === '100to200') matchesPrice = item.price >= 100 && item.price <= 200;
        else if (priceRange === 'above200') matchesPrice = item.price > 200;

        return matchesCategory && matchesSearch && matchesVeg && matchesNonVeg && matchesAvailability && matchesPrice;
    }).sort((a, b) => {
        if (sortBy === 'priceLow') return a.price - b.price;
        if (sortBy === 'priceHigh') return b.price - a.price;
        return 0; // recommended (default order)
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const currentItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery, onlyVeg, onlyNonVeg, sortBy, priceRange]);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const renderPaginationButtons = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages.map((page, index) => (
            page === '...' ? (
                <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
            ) : (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    {page}
                </button>
            )
        ));
    };

    const scrollCategories = (direction) => {
        if (categoryScrollRef.current) {
            const scrollAmount = 200;
            categoryScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-32 font-sans">
            {/* Sticky Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    {/* Top Row: Title & Cart */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-xl">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Our Menu</h1>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{filteredItems.length} items</p>
                            </div>
                        </div>


                    </div>

                    {/* Middle Row: Search & Veg Toggle */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-grow group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for food..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-10 py-3 bg-gray-100/50 border-none rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-200/50 rounded-full p-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setOnlyVeg(!onlyVeg);
                                if (!onlyVeg) setOnlyNonVeg(false);
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 group ${onlyVeg
                                ? 'bg-green-50 border-green-500 text-green-700 shadow-md shadow-green-100'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-green-200 hover:text-green-600 hover:shadow-sm'
                                }`}
                        >
                            <div className={`p-1.5 rounded-full transition-colors ${onlyVeg ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-green-100 group-hover:text-green-500'}`}>
                                <Leaf className="w-4 h-4 fill-current" />
                            </div>
                            <span className="font-bold text-sm">Veg Only</span>
                        </button>

                        <button
                            onClick={() => {
                                setOnlyNonVeg(!onlyNonVeg);
                                if (!onlyNonVeg) setOnlyVeg(false);
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 group ${onlyNonVeg
                                ? 'bg-red-50 border-red-500 text-red-700 shadow-md shadow-red-100'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-600 hover:shadow-sm'
                                }`}
                        >
                            <div className={`p-1.5 rounded-full transition-colors ${onlyNonVeg ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-red-100 group-hover:text-red-500'}`}>
                                <Drumstick className="w-4 h-4 fill-current" />
                            </div>
                            <span className="font-bold text-sm">Non-Veg Only</span>
                        </button>


                    </div>

                    {/* Bottom Row: Categories (Horizontal Scroll) */}
                    <div className="relative mt-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none sm:hidden" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none sm:hidden" />

                        <div
                            ref={categoryScrollRef}
                            className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {CATEGORIES.map((cat, idx) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`
                                        snap-start shrink-0 px-5 py-2 rounded-full font-bold text-sm transition-all
                                        ${selectedCategory === cat
                                            ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                                            : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:border-gray-200'}
                                    `}
                                >
                                    {cat}
                                </button>
                            ))}

                            {/* Filter Button */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`
                                        snap-start shrink-0 px-5 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2
                                        ${showFilters || sortBy !== 'recommended' || priceRange !== 'all'
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                                        : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:border-gray-200'}
                                    `}
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filters</span>
                                {(sortBy !== 'recommended' || priceRange !== 'all') && (
                                    <span className="bg-white text-primary text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                        {(sortBy !== 'recommended' ? 1 : 0) + (priceRange !== 'all' ? 1 : 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Filter Modal (Fixed Position) */}
                    {showFilters && (
                        <>
                            <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm" onClick={() => setShowFilters(false)}></div>
                            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-[70] animate-scale-up">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-gray-900">Filters</h2>
                                    <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Sort Section */}
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</h3>
                                        <div className="space-y-2">
                                            {[
                                                { label: 'Recommended', value: 'recommended' },
                                                { label: 'Price: Low to High', value: 'priceLow' },
                                                { label: 'Price: High to Low', value: 'priceHigh' },
                                            ].map((option) => (
                                                <label key={option.value} className="flex items-center justify-between cursor-pointer group p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                                    <span className={`text-sm font-medium transition-colors ${sortBy === option.value ? 'text-primary' : 'text-gray-600 group-hover:text-gray-900'}`}>{option.label}</span>
                                                    <input
                                                        type="radio"
                                                        name="sort"
                                                        className="accent-primary w-4 h-4"
                                                        checked={sortBy === option.value}
                                                        onChange={() => setSortBy(option.value)}
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-100"></div>

                                    {/* Price Range Section */}
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Price Range</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { label: 'Any', value: 'all' },
                                                { label: 'Under ₹100', value: 'under100' },
                                                { label: '₹100 - ₹200', value: '100to200' },
                                                { label: 'Above ₹200', value: 'above200' },
                                            ].map((range) => (
                                                <button
                                                    key={range.value}
                                                    onClick={() => setPriceRange(range.value)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${priceRange === range.value
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {range.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        {(sortBy !== 'recommended' || priceRange !== 'all') && (
                                            <button
                                                onClick={() => { setSortBy('recommended'); setPriceRange('all'); }}
                                                className="flex-1 py-3 text-sm text-red-500 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                            >
                                                Clear
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="flex-1 py-3 text-sm text-white font-bold bg-primary hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-20">
                        <Loader className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Loading delicious items...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 rounded-3xl">
                        <p className="text-red-500 font-bold">{error}</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 border-dashed">
                        <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No items found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                        <button
                            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setOnlyVeg(false); setOnlyNonVeg(false); setSortBy('recommended'); setPriceRange('all'); }}
                            className="mt-6 text-primary font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                        {currentItems.map((item, index) => (
                            <FoodCard key={item._id} item={item} onAdd={useCart().addToCart} index={index} />
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && !error && filteredItems.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center mt-12">
                        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-2 gap-1 sm:gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {renderPaginationButtons()}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Floating Cart Bar */}
            {totalItems > 0 && (
                <div className="fixed bottom-6 left-4 right-4 z-50 animate-slide-up">
                    <Link to="/cart" className="bg-primary text-white p-3 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-between hover:bg-primary-hover transition-all group border border-white/20 backdrop-blur-xl max-w-xl mx-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <ShoppingCart className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-[10px] text-white/80 uppercase tracking-wider leading-none mb-0.5">{totalItems} ITEMS</span>
                                <span className="font-black text-lg text-white leading-none">₹{totalAmount}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 font-bold bg-white text-primary px-4 py-2 rounded-xl shadow-sm group-hover:bg-white/90 transition-colors text-sm">
                            View Cart
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
