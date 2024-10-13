"use client"
import Image from "next/image";
import { Button } from 'primereact/button';
import styles from './auth.module.css';


const AuthPage = () => {

    const handleLoginClick = () => {
        window.location.href = 'http://localhost:8000/auth-google';
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
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