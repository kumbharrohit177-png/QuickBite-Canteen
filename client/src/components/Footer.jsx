import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="space-y-4" id="about">
                        <div className="flex items-center gap-2 text-white text-2xl font-black tracking-tight">
                            <span className="bg-orange-600 text-white p-1 rounded-lg">QB</span>
                            <span>QuickBite</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Revolutionizing campus dining with smart pre-ordering. Skip queues, save time, and enjoy fresh food daily.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialLink icon={<Facebook className="w-5 h-5" />} />
                            <SocialLink icon={<Twitter className="w-5 h-5" />} />
                            <SocialLink icon={<Instagram className="w-5 h-5" />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink to="/">Home</FooterLink></li>
                            <li><FooterLink to="/menu">Browse Menu</FooterLink></li>
                            <li><FooterLink to="/orders">My Orders</FooterLink></li>
                            <li><FooterLink to="/login">Login</FooterLink></li>
                            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
                            <li><FooterLink to="/terms">Terms & Conditions</FooterLink></li>
                            <li><FooterLink to="/refund-policy">Refund Policy</FooterLink></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div id="contact">
                        <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>University Campus, Block C,<br />Xie Canteen</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                                <span>support@quickbite.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter or Hours */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Opening Hours</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex justify-between border-b border-gray-800 pb-2">
                                <span>Mon - Fri</span>
                                <span className="text-white">8:00 AM - 6:00 PM</span>
                            </li>
                            <li className="flex justify-between border-b border-gray-800 pb-2">
                                <span>Saturday</span>
                                <span className="text-white">9:00 AM - 4:00 PM</span>
                            </li>
                            <li className="flex justify-between pb-2">
                                <span>Sunday</span>
                                <span className="text-orange-500">Closed</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>© 2026 QuickBite Systems. All rights reserved.</p>
                    <div className="flex items-center gap-1 text-gray-500">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                        <span>for smart students.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon }) {
    return (
        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
            {icon}
        </a>
    );
}

function FooterLink({ to, children }) {
    return (
        <Link to={to} className="hover:text-orange-500 transition-colors flex items-center gap-2 group">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            {children}
        </Link>
    );
}
