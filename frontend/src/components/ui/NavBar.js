"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { handleUserLogout, useAuth } from "@/context/AuthContext";
import { Menu } from "primereact/menu";
import styles from "./navBar.module.css";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { noticeListAll } from "@/services/NoticeService";

const NavBar = ({ data = false }) => {
  const { user } = useAuth();
  const [notice, setNotice] = useState(null);
  const isUserAuth = !!user || false;
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [theme, setTheme] = useState("light"); // Estado para controlar o tema
  const [path, setPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPath(window.location.pathname); // Obtém o caminho da URL
    }
    getCurrentNotice()
  }, []);

  const getCurrentNotice = async () => {
    try {
      const value = await noticeListAll();
      const currentNotice = Array.from(value.results)
        .filter(
          (notice) =>
            new Date(notice.documentation_submission_start) <= new Date() &&
            new Date(notice.documentation_submission_end) >= new Date(),
        )
        .sort(
          (a, b) =>
            new Date(b.documentation_submission_start) -
            new Date(a.documentation_submission_start),
        )
        .slice(0, 1)[0];

      console.log(value);
      console.log('currentNotice:');
      console.log(currentNotice);
      setNotice(currentNotice);
      return currentNotice;
    } catch (error) {
      console.error("Error fetching notice:", error);
    }
  };

  const handleDropdown = () => {
    setDropdownMenu(!dropdownMenu);
  };

  const items = [
    {
      items: [
        {
          label: "Perfil",
          icon: "pi pi-user",
          command: () => (window.location.href = `/profile`),
        },
        {
          label: "Alterar dados",
          icon: "pi pi-cog",
          command: () => (window.location.href = `/register`),
        },
        {
          label: "Sair",
          icon: "pi pi-sign-out",
          command: () => handleUserLogout(),
        },
      ],
    },
  ];

  const menuAuth = () => (
    <>
      <div className="px-3">
        Bem vindo, <b>{user?.name || "Usuário"}</b>
      </div>
      <div className="px-2">
        <button
          style={{
            border: "1px solid grey",
            padding: "10px",
            borderRadius: "15px",
          }}
          onClick={handleDropdown}
        >
          Menu de Agora
        </button>
        {dropdownMenu ? (
          <Menu
            model={items}
            className="absolute z-50"
            popupAlignment="right"
          />
        ) : (
          ""
        )}
      </div>
    </>
  );

  //função para ambiente de dev
  const menuAuthDev = () => (
    <>
      <div
        className="px-3"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <span>
          Bem vindo, <b>{user?.name || "Usuário"}</b>
        </span>
        <strong style={{ textAlign: "center" }}>
          {user?.type || "Tipo de Usuário"}
        </strong>
      </div>
      <div className="px-2">
        <MenuIcon
          onClick={handleDropdown}
          style={{ cursor: "pointer" }}
        ></MenuIcon>
        {dropdownMenu ? (
          <Menu
            model={items}
            className="absolute z-50 right-10"
            popupAlignment="right"
          />
        ) : (
          ""
        )}
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

  const navOptions = () => (
    <>
      <ul className={styles.navBarOptions} style={{ listStyle: "none" }}>
        <li
          onClick={() => (window.location.href = `/home`)}
          className={path === "/home" ? styles.active : ""}
        >
          Home
        </li>
        <li
          onClick={() => (window.location.href = `/requests`)}
          className={path === "/requests" ? styles.active : ""}
        >
          Solicitações
        </li>
        <li
          onClick={() => (window.location.href = `/notice`)}
          className={path === "/notice" ? styles.active : ""}
        >
          Editais
        </li>
        <li
          onClick={() => (window.location.href = `/courses`)}
          className={path === "/courses" ? styles.active : ""}
        >
          Cursos
        </li>
        {user.type === "Estudante" && notice && (
          <li
            onClick={() => (window.location.href = `/requests/requestForm`)}
            className={path === "/requests/requestForm" ? styles.active : ""}
          >
            Realizar Solicitação
          </li>
        )}
        {(user?.type === "Coordenador" || user?.type === "Ensino") &&
          user?.is_verified && (
            <>
              <li
                onClick={() => (window.location.href = `/usersList`)}
                className={path === "/usersList" ? styles.active : ""}
              >
                Usuários
              </li>
              <li
                onClick={() => (window.location.href = `/discipline`)}
                className={path === "/discipline" ? styles.active : ""}
              >
                Cadastrar Disciplina
              </li>
            </>
          )}
      </ul>
    </>
  );

  // Função para alternar entre temas
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.remove(theme);
    document.body.classList.add(newTheme);
  };

  useEffect(() => {
    // Adiciona o tema inicial com base na preferência do usuário ou no estado
    document.body.classList.add(theme);
  }, []);

  return (
    <div style={{ backgroundColor: "#2f9e41" }}>
      <div className="flex items-center justify-between max-w-screen-xlg pl-20 pt-8 pb-8 pr-20 mx-auto">
        <Link href={isUserAuth ? "/profile" : "/auth"} className="pl-12">
          <Image
            src="/ifrs.png"
            alt="IFRS Logo"
            className="dark:invert"
            height={40}
            width={151}
          />
        </Link>
        {isUserAuth ? navOptions() : ""}
        <div className="flex items-center justify-around text-white">
          {isUserAuth ? menuAuthDev() : menuNotAuth()}
          {theme === "light" ? (
            <DarkModeIcon cursor="pointer" onClick={toggleTheme} />
          ) : (
            <LightModeIcon cursor="pointer" onClick={toggleTheme} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
