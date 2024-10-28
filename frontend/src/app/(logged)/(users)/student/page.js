"use client";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import { Button } from "@/components/Button/button";

const StudentPage = () => {
  const router = useRouter();

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.profileOptions}>
        <Button onClick={() => router.push("/requests/requestForm")}>
          Realizar Solicitação
        </Button>
      </div>
    </div>
  );
};

export default StudentPage;
