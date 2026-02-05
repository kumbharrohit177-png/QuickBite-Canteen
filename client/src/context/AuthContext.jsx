import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from local storage on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Ideally, we should have a /me endpoint to validate token and get user data
                // For now, we'll try to decode from storage or just assume valid if we (later) implement persistence better
                // But specifically for this MVP, let's just keep the user if we have their data in localStorage too
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Auth Error:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error("Login Details:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.msg || 'Login failed'
            };
        }
    };

    const googleLogin = async (token) => {
        try {
            console.log("Sending Google token to backend:", token.substring(0, 10) + "...");
            const res = await api.post('/auth/google', { token });
            console.log("Backend response:", res.data);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (error) {
            console.error("Google Login Error in Context:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.msg || 'Google Login failed' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const res = await api.post('/auth/signup', { name, email, password });
            // Don't auto-login
            return { success: true };


        } catch (error) {
            console.error("Signup Details:", error.response?.data);
            return {
                success: false,
                message: error.response?.data?.msg || 'Signup failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, googleLogin, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
