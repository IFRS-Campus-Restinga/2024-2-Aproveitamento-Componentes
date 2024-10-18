"use client";
import Image from "next/image";
import styles from "./footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.container}>
      <Image
        src="/Logo-Ifrs-Preto-Horizontal.png"
        alt="IFRS Logo"
        className="dark:invert mr-20"
        height={90}
        width={200}
      />
      <div className={styles.infoContainer}>
        <span className={styles.name}>
          Instituto Federal do Rio Grande do Sul, Campus Restinga
        </span>
        <span>Rua Alberto Hoffmann, 285 - Restinga, Porto Alegre / RS</span>
        <span>CEP: 91791-508 - Fone: (51) 3247-8400</span>
      </div>
    </footer>
  );
};