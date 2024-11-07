'use client'
import AuthService from "@/services/AuthService";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
const AuthContext = React.createContext({
    user: null,
});

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const pathname = usePathname();

    React.useEffect(() => {
        const fetchUsuario = async () => {
            const accessToken = localStorage.getItem('token');
            if (!accessToken && pathname !== '/auth') {
                window.location.href = '/auth';
            }

            if (!accessToken) {
                setLoading(false);
                return;
            }
            try {

                const data = await AuthService.UserDetails();
                if ('noUser' in data) {
                    setLoading(false);
                    if (pathname !== '/register') {
                        window.location.href = ('/register')
                    }
                    return setUser(null);
                }

                setUser(data);
            } catch (error) {
                setUser(null);
                localStorage.removeItem('token');
                if (pathname !== '/auth') {
                    window.location.href = '/auth';
                }
                console.error(error);
            }
            setLoading(false);
        }

        fetchUsuario();
    }, []);

    const value = {
        user,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const handleUserLogout = async () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
}