import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Utensils, CheckCircle, Smartphone, ArrowRight, Star, Search, MapPin, Tag, ChevronDown, ChevronUp, Info, MousePointerClick, ShoppingBag, CreditCard, User, Mail, Phone, Zap, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

import logo from '../assets/logo.png';
import aboutImage from '../assets/my-photo.jpg.jpeg';


// Simple hook for scroll animation
const useScrollReveal = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach((el) => observer.observe(el));

        return () => elements.forEach((el) => observer.unobserve(el));
    }, []);
};

export default function Home() {
    useScrollReveal();
    const { addToCart } = useCart();

    // Hero Carousel Images (from menu)
    const [heroImages, setHeroImages] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [activeTab, setActiveTab] = useState('popular');

    useEffect(() => {
        const fetchMenuImages = async () => {
            try {
                // Determine base URL based on environment
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${baseUrl}/menu`);
                const data = await res.json();

                // Enhance data with mock stats for social proof
                const enhancedData = data.map((item, index) => ({
                    ...item,
                    rating: item.rating || (4.2 + (index % 5) * 0.15).toFixed(1), // Deterministic pseudo-random
                    orderCount: item.orderCount || 100 + index * 10,
                    isNew: index < 5 // First 5 items are always 'new'
                }));
                setMenuItems(enhancedData);

                // Filter items that have images and are available
                const availableItems = data.filter(item => item.image && item.available);

                // Prioritize "Chicken Dum Biryani"
                // First try exact match, then partial match for "Chicken Biryani"
                const specificItem = availableItems.find(item =>
                    item.name.toLowerCase().includes('chicken dum biryani') ||
                    item.name.toLowerCase().includes('chicken biryani')
                );

                // Filter out the specific item from the pool to avoid duplicates
                const otherItems = availableItems.filter(item => item !== specificItem);

                // Shuffle other items
                const shuffledOthers = otherItems.sort(() => 0.5 - Math.random());

                // Construct final list: [Specific Item] + [4 Random Others]
                let selectedImages = [];
                if (specificItem) {
                    selectedImages.push(specificItem.image);
                }

                // Fill remaining slots
                const needed = 5 - selectedImages.length;
                const others = shuffledOthers.slice(0, needed).map(item => item.image);

                selectedImages = [...selectedImages, ...others];

                if (selectedImages.length > 0) {
                    setHeroImages(selectedImages);
                } else {
                    // Fallback images if no menu items found
                    setHeroImages([
                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500", // Burger
                        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=500", // Pasta
                        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=500", // Sandwich
                        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=500"  // Pizza
                    ]);
                }
            } catch (err) {
                console.error("Failed to fetch menu images:", err);
                // Fallback images on error
                setHeroImages([
                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500", // Burger
                    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=500", // Pasta
                    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=500", // Sandwich
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=500"  // Pizza
                ]);
            }
        };
        fetchMenuImages();
    }, []);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (heroImages.length === 0) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [heroImages]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary to-primary-hover text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-2 border border-white/20">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                    </span>
                                    #1 Food Delivery App in Campus
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight overflow-visible">
                                    <span key={`text1-${currentImageIndex}`} className="block animate-slide-left" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
                                        Skip the Queue.
                                    </span>
                                    <span key={`text2-${currentImageIndex}`} className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-gradient-x bg-[length:200%_auto] animate-slide-right" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
                                        Enjoy Your Break.
                                    </span>
                                </h1>
                                <p className="text-xl text-white/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                    Skip the endless queues. Order from your favorite campus canteens and enjoy hot, fresh food delivered in minutes.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                <Link
                                    to="/menu"
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-2xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-xl shadow-black/10"
                                >
                                    Order Now <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white transition-all"
                                >
                                    Sign In
                                </Link>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                                <div className="text-left">
                                    <p className="text-3xl font-bold text-white">15m</p>
                                    <p className="text-sm text-white/80 font-medium">Avg. Delivery</p>
                                </div>
                                <div className="w-px h-10 bg-white/20"></div>
                                <div className="text-left">
                                    <p className="text-3xl font-bold text-white">5k+</p>
                                    <p className="text-sm text-white/80 font-medium">Happy Students</p>
                                </div>
                                <div className="w-px h-10 bg-white/20"></div>
                                <div className="text-left">
                                    <p className="text-3xl font-bold text-white">50+</p>
                                    <p className="text-sm text-white/80 font-medium">Menu Items</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-3 hover:rotate-0 transition-all duration-500 group h-[500px]">
                                {heroImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Delicious Food ${index + 1}`}
                                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    />
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8 text-white z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Featured</span>
                                        <div className="flex text-yellow-400">
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                    <p className="font-bold text-2xl mb-1 drop-shadow-md">Premium Quality Food</p>
                                    <p className="text-sm opacity-90 drop-shadow-md">Prepared by top rated chefs</p>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce duration-[3000ms] z-20">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">🔥</span>
                                    <div>
                                        <p className="font-bold text-gray-800 text-lg">Hot Deal</p>
                                        <p className="text-xs text-orange-500 font-bold uppercase tracking-wide">Limited Time Offer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ABOUT SECTION */}
            <div className="py-24 bg-gray-50" id="about">
                <div className="max-w-7xl mx-auto px-4 reveal-on-scroll">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500">
                                <img
                                    src={aboutImage}
                                    alt="About QuickBite"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                            </div>
                            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-yellow-400/30 rounded-full blur-3xl -z-10 animate-blob"></div>
                            <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/30 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000"></div>
                        </div>
                        <div>
                            <div className="inline-block px-4 py-2 bg-white/50 backdrop-blur-sm border border-orange-200 text-orange-600 rounded-full font-bold text-sm mb-6 shadow-sm">
                                Our Story
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                Redefining Campus <br /><span className="text-primary">Dining Experience</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                QuickBite is a state-of-the-art pre-ordering canteen system designed specifically for the fast-paced campus life. We bridge the gap between hungry students and busy canteens using technology.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Our mission is to eliminate long waiting lines and ensure that you spend more time enjoying your meal and less time waiting for it.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-gray-800">100% Hygienic</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-gray-800">24/7 Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* POPULAR / TRENDING SECTION */}
            <div className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-12 reveal-on-scroll">
                        <div className="inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-full font-semibold text-sm mb-4">
                            Social Proof
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 mb-4">What's Trending</h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Check out what everyone is eating right now.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12 reveal-on-scroll">
                        <button
                            onClick={() => setActiveTab('popular')}
                            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'popular' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            🔥 Most Ordered
                        </button>
                        <button
                            onClick={() => setActiveTab('rated')}
                            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'rated' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            ⭐ Top Rated
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'new' ? 'bg-primary text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            🕒 Recently Added
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {menuItems.length > 0 ? (
                            menuItems
                                .filter(item => {
                                    if (activeTab === 'popular') return true;
                                    if (activeTab === 'rated') return true; // Just sort by rating
                                    if (activeTab === 'new') return item.isNew;
                                    return true;
                                })
                                .sort((a, b) => {
                                    if (activeTab === 'popular') return b.orderCount - a.orderCount;
                                    if (activeTab === 'rated') return b.rating - a.rating;
                                    return 0;
                                })
                                .slice(0, 4)
                                .map((item, index) => (
                                    <div key={item._id || index} className="group bg-white rounded-3xl p-4 shadow-card hover:shadow-hover transition-all duration-300 border border-gray-100 relative hover:-translate-y-2 cursor-pointer">
                                        <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                                                {activeTab === 'popular' && `🔥 ${item.orderCount} Orders`}
                                                {activeTab === 'rated' && `⭐ ${item.rating}`}
                                                {activeTab === 'new' && '🆕 New Arrival'}
                                            </div>
                                        </div>
                                        <div className="px-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
                                                    ₹{item.price}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{item.description}</p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(item);
                                                    toast.success(`${item.name} added to cart! 🛒`);
                                                }}
                                                className="w-full py-3 bg-gray-50 text-gray-900 font-bold rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            // Skeleton Loading State
                            [1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-gray-100 rounded-3xl h-80 animate-pulse"></div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* WHY CHOOSE US - FEATURES */}
            <div className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <div className="text-center mb-20 reveal-on-scroll">
                        <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Why Choose Us</h2>
                        <h3 className="text-4xl font-black text-gray-900 mb-6">We Serve The Best</h3>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            Elevate your campus dining experience with features designed for your convenience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-yellow-600" />}
                            title="Lightning Fast"
                            desc="Get your food delivered in record time. No more waiting during short breaks."
                            color="bg-yellow-100"
                            delay="0.1s"
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-6 h-6 text-green-600" />}
                            title="100% Hygienic"
                            desc="We ensure strict hygiene standards for all our partner kitchens."
                            color="bg-green-100"
                            delay="0.2s"
                        />
                        <FeatureCard
                            icon={<Heart className="w-6 h-6 text-rose-600" />}
                            title="Made with Love"
                            desc="Home-style meals prepared with fresh ingredients and care."
                            color="bg-rose-100"
                            delay="0.3s"
                        />
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center reveal-on-scroll">
                        <div>
                            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">How It Works</span>
                            <h2 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                                Simple Steps to <br />
                                <span className="text-primary">Delicious Food</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Don't let hunger distract you from your studies. Order food in seconds and pick it up when it's ready.
                            </p>

                            <div className="space-y-8">
                                <StepItem
                                    number="01"
                                    title="Browse Menu"
                                    desc="Explore a wide variety of cuisines from your campus canteens."
                                />
                                <StepItem
                                    number="02"
                                    title="Place Order"
                                    desc="Customize your meal and pay securely online."
                                />
                                <StepItem
                                    number="03"
                                    title="Enjoy Meal"
                                    desc="Pick up your hot meal from the counter. No waiting."
                                />
                            </div>
                        </div>
                        <div className="relative perspective-1000">
                            <div className="relative rotate-3d hover-lift">
                                <img
                                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
                                    alt="Food"
                                    className="rounded-[2.5rem] shadow-2xl relative z-10 w-full object-cover h-[600px]"
                                />
                                <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-3xl z-20 animate-bounce-in max-w-xs backdrop-blur-xl bg-white/80">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <Utensils className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">50+ Restaurants</p>
                                            <p className="text-sm text-gray-500">Partnered Canteens</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BENEFITS SECTION */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 reveal-on-scroll">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-2 bg-green-50 text-green-600 rounded-full font-semibold text-sm mb-4">
                            Why Us?
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Benefits of QuickBite</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Why students and staff love using our platform</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <BenefitCard
                            icon={<Clock className="w-6 h-6 text-primary" />}
                            title="Save Time"
                            desc="No more standing in long queues during break time."
                        />
                        <BenefitCard
                            icon={<Smartphone className="w-6 h-6 text-blue-500" />}
                            title="Contactless"
                            desc="Safe and hygienic digital ordering and payment."
                        />
                        <BenefitCard
                            icon={<Tag className="w-6 h-6 text-green-500" />}
                            title="Best Offers"
                            desc="Exclusive student discounts and daily deals."
                        />
                        <BenefitCard
                            icon={<MapPin className="w-6 h-6 text-purple-500" />}
                            title="Live Tracking"
                            desc="Track your order status in real-time."
                        />
                    </div>
                </div>
            </div>

            {/* MOBILE APP PREVIEW SECTION */}
            <div className="py-24 relative overflow-hidden bg-slate-900">
                {/* Futuristic Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span className="text-xs font-bold text-white tracking-wider uppercase">Coming Soon</span>
                            </div>

                            <h2 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-tight">
                                Experience <br />
                                <span className="text-primary">QuickBite App</span>
                            </h2>

                            <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                                The future of campus dining is in your pocket. Pre-order, track live status, and unlock exclusive app-only rewards with our new mobile experience.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-xl hover:scale-105 transition-transform font-bold disabled:opacity-75 disabled:cursor-not-allowed">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M17.45 1.55c-.56-.56-1.33-.87-2.12-.87H5.33C3.27.68 1.6 2.35 1.6 4.41v15.18c0 2.06 1.67 3.73 3.73 3.73h10c2.06 0 3.73-1.67 3.73-3.73V4.41c0-2.06-1.67-3.73-3.73-3.73h-.12zM12 19.33c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5.33-3.33H6.67V5.33h10.66v10.67z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xs font-medium">Download on the</div>
                                        <div className="text-sm">App Store</div>
                                    </div>
                                </button>
                                <button className="flex items-center gap-3 bg-transparent border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition-colors font-bold disabled:opacity-75 disabled:cursor-not-allowed">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M3.6 2.6l12.6 7-6.2 3.6-6.4 3.7V2.6zm.5 14.3l5.8-3.4 3.7 2.1-9.5 5.5v-4.2zm6.7-3.9l6.3-3.7 3.5 1.9-9.8 1.8zm6.7-3.9l-5.6 3.2 2.7 1.6 2.9-4.8z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-xs font-medium">Get it on</div>
                                        <div className="text-sm">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="relative flex justify-center perspective-1000">
                            {/* Phone Mockup */}
                            <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-all duration-700 hover:scale-105 z-20">
                                {/* Screen Content */}
                                <div className="absolute inset-0 bg-white">
                                    {/* App Header */}
                                    <div className="h-24 bg-primary p-6 pt-10 flex justify-between items-center text-white">
                                        <span className="font-bold text-lg">QuickBite</span>
                                        <div className="w-8 h-8 rounded-full bg-white/20"></div>
                                    </div>
                                    {/* App Body */}
                                    <div className="p-4 space-y-4 overflow-hidden">
                                        {/* Featured Item */}
                                        <div className="relative h-32 bg-gray-100 rounded-2xl overflow-hidden shadow-sm group cursor-pointer hover:shadow-md transition-all">
                                            <img
                                                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400"
                                                alt="Special Pizza"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white">
                                                <p className="text-xs font-bold bg-orange-500 inline-block px-2 py-0.5 rounded-full mb-1">Promo</p>
                                                <p className="text-sm font-bold">Supreme Pizza</p>
                                            </div>
                                        </div>

                                        {/* Categories */}
                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                            <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                                    <Utensils className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-medium text-gray-600">Lunch</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                    <ShoppingBag className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-medium text-gray-600">Snacks</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-medium text-gray-600">Fast</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                    <Star className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-medium text-gray-600">Deals</span>
                                            </div>
                                        </div>

                                        {/* Popular Items List */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-sm font-bold text-gray-800">Popular Now</h4>
                                                <span className="text-[10px] text-primary font-medium">See All</span>
                                            </div>
                                            <div className="space-y-3">
                                                {/* Item 1 */}
                                                <div className="flex gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                                                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100" alt="Food" className="w-14 h-14 rounded-lg object-cover" />
                                                    <div className="flex-1">
                                                        <h5 className="text-xs font-bold text-gray-800 truncate">Veggie Salad Bowl</h5>
                                                        <p className="text-[10px] text-gray-500">Healthy & Fresh</p>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <span className="text-xs font-bold text-primary">$12.99</span>
                                                            <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-[10px]">+</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Item 2 */}
                                                <div className="flex gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                                                    <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=100" alt="Burger" className="w-14 h-14 rounded-lg object-cover" />
                                                    <div className="flex-1">
                                                        <h5 className="text-xs font-bold text-gray-800 truncate">Classic Cheese Burger</h5>
                                                        <p className="text-[10px] text-gray-500">Juicy Beef Patty</p>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <span className="text-xs font-bold text-primary">$8.99</span>
                                                            <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-[10px]">+</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Bottom Nav Placeholder */}
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex justify-around items-center px-4">
                                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                        <div className="w-10 h-10 bg-primary rounded-full -mt-6 border-4 border-white shadow-lg"></div>
                                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                    </div>
                                </div>
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-30"></div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute top-1/4 -right-4 bg-white p-3 rounded-2xl shadow-xl animate-bounce-in z-30 flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Order Placed!</p>
                                    <p className="text-[10px] text-gray-500">Just now</p>
                                </div>
                            </div>

                            <div className="absolute bottom-1/4 -left-8 bg-white p-3 rounded-2xl shadow-xl animate-bounce-in z-30 flex items-center gap-3 animation-delay-500">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                    <Utensils className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Tasty! 😋</p>
                                    <p className="text-[10px] text-gray-500">Chicken Biryani</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* NEWSLETTER / CTA */}
            <div className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 md:px-8">
                    <div className="bg-gradient-to-r from-primary to-rose-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden reveal-on-scroll shadow-2xl shadow-primary/30">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Skip the Line?</h2>
                            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
                                Join thousands of students enjoying hassle-free dining today.
                            </p>
                            <Link
                                to="/menu"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all hover:scale-105 shadow-xl"
                            >
                                Explore Menu <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components



function BenefitCard({ icon, title, desc }) {
    return (
        <div className="p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{desc}</p>
        </div>
    );
}

function StepItem({ number, title, desc }) {
    return (
        <div className="flex items-start gap-6 group">
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-lg flex items-center justify-center text-xl font-black text-gray-300 group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                {number}
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-gray-600 font-medium">{desc}</p>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, desc, color }) {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1">
            <div className={`${color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{desc}</p>
        </div>
    );
}
