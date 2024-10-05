"use client"
import React, { useRef, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import ptBR from 'date-fns/locale/pt-BR';




const NavBar = ({ auth = false }) => {

    const menuAuth = () => (
        <>
            <div className='px-3'>Bem vindo, <b>{'Usuário'}</b></div>
            <div className='px-2'>
                <Link href="/auth" className="flex p-2 font-bold border-2 border-solid rounded anchor-link align-center border-black/30">
                    <span>Logout</span>
                    <span className='p-icon pi pi-fw pi-sign-in ms-2'></span>
                </Link>
            </div>
        </>
    );

    const menuNotAuth = () => (
        <>
            <div className='px-3'>Você ainda não se identificou</div>
            <div className='px-2'>
                <Link href="/auth" className="flex p-2 font-bold border-2 border-solid rounded anchor-link align-center border-black/30">
                    <span>Acessar</span>
                    <span className='p-icon pi pi-fw pi-sign-in ms-2'></span>
                </Link>
            </div>
        </>
    );

    return (
        <div style={{ backgroundColor: '#2f9e41' }}>
            <div className='flex items-center justify-between max-w-screen-lg p-3 mx-auto'>
                <Link href="/">
                    <Image
                        src="/ifrs.png"
                        alt="IFRS Logo"
                        className="dark:invert"
                        height={40}
                        width={151}
                    />
                </Link>

                <div className='flex items-center justify-around text-white'>
                    {auth ? menuAuth() : menuNotAuth()}
                </div>
            </div>
            <style jsx>{`
                .suggestions-container {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background-color: white;
                    border: 1px solid #ccc;
                    border-top: none;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    width: 100%;
                }
                .suggestion-item {
                    padding: 10px;
                    cursor: pointer;
                }
                .suggestion-item:hover {
                    background-color: #f0f0f0;
                }
            `}</style>
        </div>
    );
}

export default NavBar;
