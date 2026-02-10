import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Utensils, CheckCircle, Smartphone, ArrowRight, Star, Search, MapPin, Tag, ChevronDown, ChevronUp, Info, MousePointerClick, ShoppingBag, CreditCard, User, Mail, Phone } from 'lucide-react';

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

    // Hero Carousel Images (from menu)
    const heroImages = [
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=500", // Biryani
        "https://images.unsplash.com/photo-1603133872878-684f10842740?auto=format&fit=crop&q=80&w=500", // Fried Rice
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=500", // Chicken Biryani
        "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=500"  // Medu Vada
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);

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

            {/* About System Section */}
            <div className="py-24 bg-white" id="about">
                <div className="max-w-7xl mx-auto px-4 reveal-on-scroll">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-xl">
                                <img
                                    src={aboutImage}
                                    alt="About QuickBite"
                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="absolute inset-0 bg-primary/10"></div>
                            </div>
                            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
                        </div>
                        <div>
                            <div className="inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-full font-semibold text-sm mb-6">
                                About Us
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">Redefining Campus Dining Experience</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                QuickBite is a state-of-the-art pre-ordering canteen system designed specifically for the fast-paced campus life. We bridge the gap between hungry students and busy canteens using technology.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Our mission is to eliminate long waiting lines and ensure that you spend more time enjoying your meal and less time waiting for it.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-gray-700">100% Hygienic</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-gray-700">Live Support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 reveal-on-scroll">
                    <div className="text-center mb-20">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Simple Process</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">How It Works</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            From hunger to happiness in 3 simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line - Background Layer for Desktop */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 -translate-y-1/2 -z-10"></div>

                        {[
                            {
                                id: "01",
                                title: "Browse & Select",
                                desc: "Explore menus from all campus canteens. Filter by category, price, or rating.",
                                icon: <MousePointerClick className="w-8 h-8 text-white" />,
                                color: "bg-blue-500",
                                shadow: "shadow-blue-200"
                            },
                            {
                                id: "02",
                                title: "Pay Online",
                                desc: "Securely pay using UPI, Wallets, or Cards. No need to carry cash anymore.",
                                icon: <CreditCard className="w-8 h-8 text-white" />,
                                color: "bg-primary",
                                shadow: "shadow-orange-200"
                            },
                            {
                                id: "03",
                                title: "Pick & Enjoy",
                                desc: "Get notified when your order is ready. Skip the line and pick up your hot meal.",
                                icon: <ShoppingBag className="w-8 h-8 text-white" />,
                                color: "bg-green-500",
                                shadow: "shadow-green-200"
                            }
                        ].map((step, index) => (
                            <div key={index} className="relative group">
                                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100/50 hover:-translate-y-2 transition-all duration-300 h-full relative overflow-hidden">


                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center shadow-lg ${step.shadow} mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                            {step.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Show your <strong>Student ID</strong> at the counter to verify your identity and collect your food.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 reveal-on-scroll">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-2 bg-green-50 text-green-600 rounded-full font-semibold text-sm mb-4">
                            Why Us?
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits of QuickBite</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Why students and staff love using our platform</p>
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



            {/* Features Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 reveal-on-scroll">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Amazing Features</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Experience the best campus food ordering with our amazing features</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Smartphone className="w-8 h-8 text-white" />}
                            title="Easy Ordering"
                            desc="Simple and intuitive app interface for quick food ordering"
                            color="bg-primary"
                        />
                        <FeatureCard
                            icon={<Clock className="w-8 h-8 text-white" />}
                            title="Fast Delivery"
                            desc="Get your food delivered hot and fresh in 30 minutes"
                            color="bg-green-500"
                        />
                        <FeatureCard
                            icon={<CheckCircle className="w-8 h-8 text-white" />}
                            title="Quality Food"
                            desc="Hygienic preparation with fresh ingredients daily"
                            color="bg-orange-500"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Us Section */}
            <div className="py-24 bg-gray-50" id="contact">
                <div className="max-w-7xl mx-auto px-4 reveal-on-scroll">
                    <div className="grid md:grid-cols-2 gap-12 rounded-3xl bg-white p-8 lg:p-12 shadow-sm border border-gray-100">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                            <p className="text-gray-600 mb-8">
                                Have questions or suggestions? We'd love to hear from you. Reach out to our support team.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Email Us</h3>
                                        <p className="text-gray-600">support@quickbite.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Call Us</h3>
                                        <p className="text-gray-600">+91 98765 43210</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Visit Us</h3>
                                        <p className="text-gray-600">Student Center, Main Campus</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="How can we help?"></textarea>
                            </div>
                            <button className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                                Send Message
                            </button>
                        </form>
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
