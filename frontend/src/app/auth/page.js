"use client"
import Image from "next/image";
import { Button } from 'primereact/button';


const AuthPage = () => {

    const handleLoginClick = () => {
        window.location.href = 'http://localhost:8000/auth-google';
    };

    return (
        <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col mt-40'>
            <div className='flex flex-wrap align-items-center justify-around items-center py-10'>
                <div>
                    <Image
                        src="/ifrs_colorido.svg"
                        alt="IFRS Logo"
                        height={100}
                        width={400}
                    />
                </div>
                <div>
                    <Button onClick={handleLoginClick} label="Entrar com o Google" icon="pi pi-google" className="p-button-raised p-button-rounded p-button-lg p-m-2" />
                </div>
            </div>
        </div>
    );
}

export default AuthPage;