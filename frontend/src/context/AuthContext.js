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
    const pathname = usePathname();

    const router = useRouter();

    React.useEffect(() => {
        const fetchUsuario = async () => {
            const accessToken = localStorage.getItem('token');
            console.log(accessToken);
            if (!accessToken) {
                window.location.href = '/auth';
                return;
            }
            try {

                const data = await AuthService.detalhesUsuario();
                console.log(data);
                setUser(data);

            } catch (error) {
                setUser(null);
                localStorage.removeItem('token');
                if (router.pathname !== '/auth') {
                    const data = await AuthService.detalhesUsuario();
                    console.log(data);
                    window.location.href = ('/auth');

                }
                console.error(error);
            }
        }

        fetchUsuario();

    }, [pathname]);

    const value = {
        user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const handleUserLogout = async () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
}