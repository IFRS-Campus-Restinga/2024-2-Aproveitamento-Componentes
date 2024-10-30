'use client'
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import ptBR from 'date-fns/locale/pt-BR';
import { useAuth, handleUserLogout } from "@/context/AuthContext";
import { Button } from '@mui/material';
import { Menu } from "primereact/menu";



const NavBar = ({ data = false }) => {
  const { user } = useAuth();
  const isUserAuth = !!user || false;
  const [dropdownMenu, setDropdownMenu] = useState(false);

  const handleDropdown = () => {
    setDropdownMenu(!dropdownMenu);
  }

  const items = [
    {
      label: 'Perfil',
      items: [
        {
          label: 'Perfil',
          icon: 'pi pi-user',
          command: () => window.location.href = `/profile`
        },
        {
          label: 'Configurações',
          icon: 'pi pi-cog',
          command: () => window.location.href = `/utilsComponents`

        },
        {
          label: 'Lista de users',
          icon: 'pi pi-cog',
          command: () => window.location.href = `/usersList`

        },
        {
          label: 'Sair',
          icon: 'pi pi-sign-out',
          command: () => handleUserLogout()
        }
      ]
    }
  ];
  const menuAuth = () => (
    <>
      <div className='px-3'>Bem vindo, <b>{user?.name || 'Usuário'}</b></div>
      <div className='px-2'>
        <button style={{border: "1px solid grey", padding: "10px", borderRadius: "15px"}} onClick={handleDropdown}>Menu de Agora</button>
        {dropdownMenu ? <Menu model={items} className='absolute z-50' popupAlignment="right" /> : ''}
        <Button label="Sair" icon='p-icon pi pi-fw pi-sign-in' onClick={handleUserLogout} />
      </div>
    </>
  );

  const menuNotAuth = () => (
    <>
      <div className="px-3">Você ainda não se identificou</div>
      <div className="px-2">
        <Link
          href="/auth"
          className="flex p-2 font-bold border-2 border-solid rounded anchor-link align-center border-black/30"
        >
          <span>Acessar</span>
          <span className="p-icon pi pi-fw pi-sign-in ms-2"></span>
        </Link>
      </div>
    </>
  );

  return (
    <div style={{ backgroundColor: "#2f9e41" }}>
      <div className="flex items-center justify-between max-w-screen-lg p-3 mx-auto">
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
          {isUserAuth ? menuAuth() : menuNotAuth()}
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
