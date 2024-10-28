"use client";
import { usePathname, useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { Button } from "@/components/Button/button";
import { useState } from "react";
import ModalDisciplineRegistration from "@/components/Modal/modal";

const UserProfile = () => {
  const location = usePathname();
  const router = useRouter();
  const [modal, setModal] = useState(false);

  console.log(location);

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.profileOptions}>
        <Button onClick={() => setModal(true)}>Cadastrar Disciplina</Button>
      </div>
      {modal && <ModalDisciplineRegistration onClose={() => setModal(false)} />}
    </div>
  );
};

export default UserProfile;
