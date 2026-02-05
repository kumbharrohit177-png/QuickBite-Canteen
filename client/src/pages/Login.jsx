import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await login(email, password);
        setLoading(false);
        if (res.success) {
            navigate('/menu');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-md w-full relative z-10 animate-fade-in md:scale-100 scale-95 transition-all duration-300">
                <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <div className="bg-gradient-to-tr from-primary to-amber-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 hover:rotate-6 transition-transform">
                            <LogIn className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
                        <p className="text-gray-500 mt-2 font-medium">Sign in to crave, order, and enjoy!</p>
                    </div>

                    {error && (
                        <div className="bg-red-50/80 border border-red-100 p-4 mb-6 rounded-2xl flex items-center gap-3 animate-pulse text-red-600">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative hover-lift">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-gray-800"
                                    placeholder="student@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <div className="relative hover-lift">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-gray-800"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn mt-4
                                ${loading ? 'opacity-80' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">Processing...</span>
                            ) : (
                                <>Sign In <span className="group-hover/btn:translate-x-1 transition-transform">→</span></>
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-gray-400 text-sm font-medium">OR</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                console.log("Google Login Success (Frontend):", credentialResponse);
                                setLoading(true);
                                const res = await googleLogin(credentialResponse.credential);
                                setLoading(false);
                                if (res.success) {
                                    console.log("Google Login Flow Complete - Redirecting");
                                    navigate('/menu');
                                } else {
                                    console.error("Google Login Backend/Context Failure:", res.message);
                                    setError(res.message);
                                }
                            }}
                            onError={() => {
                                console.error("Google Login Failed (Popup level)");
                                setError('Google Login Failed');
                            }}
                            shape="circle"
                            size="large"
                            theme="outline"
                            text="continue_with"
                            width="250"
                        />
                    </div>

                    <p className="text-center mt-8 text-gray-500 font-medium">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
