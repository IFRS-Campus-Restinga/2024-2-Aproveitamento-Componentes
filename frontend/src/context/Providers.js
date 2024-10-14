'use client';
import { AuthProvider } from '@/context/AuthContext';
import NavBar from '@/components/ui/NavBar';
import { Footer } from "@/components/layout/Footer/footer";
import { PrimeReactProvider } from 'primereact/api';

export default function Providers({ children }) {
    return (
        <PrimeReactProvider>
            <AuthProvider>
                <NavBar data={true}/>
                <div style={{ minHeight: '500px' }}>
                    {children}
                </div>
                <Footer />
            </AuthProvider>
        </PrimeReactProvider>
    );
}