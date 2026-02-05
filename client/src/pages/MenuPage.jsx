import { useState, useEffect } from 'react';
import FoodCard from '../components/FoodCard';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Search, ArrowUpDown, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['All', 'Snacks', 'Lunch', 'South Indian', 'Beverages'];

export default function MenuPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState(''); // 'price-asc', 'price-desc'
    const { addToCart, totalItems } = useCart();

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await api.get('/menu');
                setMenuItems(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching menu:", err);
                setError('Failed to load menu. Please try again later.');
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 pb-32">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-4 animate-fade-in tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-500">Delicious</span> Menu
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto animate-fade-in delay-100">
                    Explore our wide range of freshly prepared dishes, snacks, and beverages.
                </p>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">QB</span>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="max-w-md mx-auto bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center mb-8 shadow-sm">
                    <p className="font-semibold">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* Search and Filter Controls */}
                    <div className="sticky top-24 z-30 glass-card p-4 rounded-2xl mb-12 animate-slide-up shadow-lg">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

                            {/* Search */}
                            <div className="relative flex-grow w-full md:w-auto md:max-w-md group">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="What are you craving?"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-700 placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Categories - Desktop / Scrollable Mobile */}
                            <div className="flex-grow w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                <div className="flex gap-2 md:justify-center">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-5 py-2.5 rounded-full whitespace-nowrap font-semibold text-sm transition-all duration-300
                                                ${selectedCategory === cat
                                                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                                                    : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
                                            `}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="relative min-w-[160px] w-full md:w-auto">
                                <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                <select
                                    className="w-full pl-10 pr-8 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/10 appearance-none font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="">Sort by</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Menu Grid */}
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-2xl font-bold text-gray-300">No items found</p>
                            <p className="text-gray-400 mt-2">Try changing your search or category</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredItems.map((item, index) => (
                                <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                    <FoodCard item={item} onAdd={addToCart} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Floating Cart Button */}
                    {totalItems > 0 && (
                        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-bounce-subtle">
                            <Link to="/cart" className="flex items-center gap-4 bg-gray-900 text-white pl-6 pr-8 py-4 rounded-full shadow-2xl hover:bg-black transition-all hover:scale-105 group border border-gray-700/50 backdrop-blur-md">
                                <div className="relative">
                                    <ShoppingCart className="w-6 h-6 group-hover:text-primary transition-colors" />
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-900">
                                        {totalItems}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</span>
                                    <span className="font-bold text-lg">View Cart</span>
                                </div>
                            </Link>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
