import { Link } from 'react-router-dom';
import { Clock, Utensils, CheckCircle, Users, Smartphone, Calendar, Zap, ArrowRight, Star } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white pb-20 pt-10 lg:pt-20">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-yellow-300 blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-orange-800 blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 space-y-8 animate-slide-up z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-medium text-orange-50">Live Campus Canteen</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                            Skip the Line, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                                Savor the Time!
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-orange-50 max-w-xl leading-relaxed">
                            Experience the future of campus dining. Pre-order your meals, schedule pickup, and enjoy fresh food without the chaos of waiting queues.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link to="/menu" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-lg shadow-xl shadow-orange-900/20 hover:bg-gray-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                Start Ordering <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                                Login Account
                            </Link>
                        </div>

                        <div className="pt-8 flex items-center gap-8 text-sm font-medium text-orange-100">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-yellow-300" />
                                <span>No Queues</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-yellow-300" />
                                <span>Hot & Fresh</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-yellow-300" />
                                <span>Secure Payment</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex justify-center animate-fade-in delay-200 relative z-10">
                        {/* Dynamic Floating Visuals */}
                        <div className="relative w-full max-w-md aspect-square">
                            {/* Main Card */}
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                                <div className="p-8 h-full flex flex-col justify-between relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-orange-100 text-sm font-medium">Order Status</p>
                                            <h3 className="text-3xl font-bold text-white mt-1">Pickup: 12:45</h3>
                                        </div>
                                        <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                            PREPARING
                                        </div>
                                    </div>

                                    <div className="space-y-4 my-8">
                                        <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-4 border border-white/10">
                                            <div className="bg-orange-100 p-2.5 rounded-xl">
                                                <Utensils className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">Veg Grilled Sandwich</p>
                                                <p className="text-orange-200 text-sm">x1 • Extra Cheese</p>
                                            </div>
                                            <span className="ml-auto font-bold text-white">₹60</span>
                                        </div>
                                        <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-4 border border-white/10">
                                            <div className="bg-orange-100 p-2.5 rounded-xl">
                                                <Utensils className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">Cold Coffee</p>
                                                <p className="text-orange-200 text-sm">x1 • Less Sugar</p>
                                            </div>
                                            <span className="ml-auto font-bold text-white">₹50</span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 flex items-center justify-between shadow-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <CheckCircle className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">Your Order</p>
                                                <p className="text-xs text-gray-500">Ready for pickup</p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-24 bg-gray-900 rounded-md flex items-center justify-center">
                                            <div className="w-16 h-1 bg-gray-700"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating decorative elements */}
                            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce-subtle z-20">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-gray-800">Top Quality</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl animate-bounce-subtle delay-300 z-20">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                                        <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                                        <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-600">Many Happy Users</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">Simple Process</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">Get your favorite food in 3 simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={<Smartphone className="w-8 h-8 text-white" />}
                            title="1. Book a Slot"
                            desc="Choose a convenient pickup time that fits your break schedule through our app."
                            color="bg-blue-500"
                            delay="0"
                        />
                        <FeatureCard
                            icon={<Utensils className="w-8 h-8 text-white" />}
                            title="2. Pre-Order Food"
                            desc="Browse the daily menu, check availability, and add your favorites to the cart."
                            color="bg-orange-500"
                            delay="100"
                        />
                        <FeatureCard
                            icon={<CheckCircle className="w-8 h-8 text-white" />}
                            title="3. Quick Collect"
                            desc="Show your digital token at the counter and pick up your meal instantly."
                            color="bg-green-500"
                            delay="200"
                        />
                    </div>
                </div>
            </div>

            {/* Trending Section */}
            <div className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">Weekly Top Picks</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Trending Now 🔥</h2>
                            <p className="text-gray-500 mt-2 text-lg">Most loved items by students this week</p>
                        </div>
                        <Link to="/menu" className="flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors group">
                            View Full Menu <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { name: "Veg Grilled Sandwich", price: 60, img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500", tag: "Bestseller" },
                            { name: "Cold Coffee", price: 50, img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500", tag: "Trending" },
                            { name: "Chicken Biryani", price: 150, img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", tag: "Hot" },
                            { name: "Masala Dosa", price: 80, img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500", tag: "Popular" }
                        ].map((item, idx) => (
                            <div key={idx} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2">
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm z-10">
                                        {item.tag}
                                    </div>
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <Link to="/menu" className="w-full bg-white text-gray-900 font-bold py-2 rounded-xl text-center shadow-lg hover:bg-orange-50 transition-colors">
                                            Order Now
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-orange-600 transition-colors">{item.name}</h3>
                                        <span className="text-gray-900 font-extrabold bg-gray-100 px-2 py-1 rounded-lg">₹{item.price}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-400 text-sm mt-3">
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <span className="text-gray-400 ml-1 text-xs">(4.8)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

function FeatureCard({ icon, title, desc, color, delay }) {
    return (
        <div
            className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 group relative overflow-hidden"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 ${color.replace('bg-', 'bg-')}/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500`}></div>

            <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}
