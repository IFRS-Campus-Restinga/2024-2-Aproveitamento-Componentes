"use client";
import { useRouter } from "next/navigation";
import styles from "./professor.module.css";
import { Button } from "@/components/Button/button";

const ProfessorPage = () => {
  const router = useRouter();

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.profileOptions}>
        <Button onClick={() => router.push("/requests")}>Solicitações</Button>
      </div>
    </div>
  );
};

export default ProfessorPage;
