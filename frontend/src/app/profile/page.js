'use client'
import { useAuth } from "@/context/AuthContext";
import styles from "./profile.module.css";
import { Button } from 'primereact/button';


const profilePage = () => {
  const { user } = useAuth();
  const isStudent = user?.type === 'Estudante';

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <h2>Informações do Usuário</h2>
          <p><strong>Nome:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Tipo:</strong> {user?.type}</p>
          {isStudent ? (
            <>
              <p><strong>Matrícula:</strong> {user?.matricula}</p>
              <p><strong>Curso:</strong> {user?.course}</p>
            </>
          ) : (
            <>
              <p><strong>SIAPE:</strong> {user?.siape}</p>
              <p><strong>Tipo de Servidor:</strong> {user?.servant_type}</p>
            </>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <Button className={styles.Button} label="Alterar dados" onClick={() => window.location.href = `/register`} />
        <Button className={styles.Button} label="Alterar dados" onClick={() => window.location.href = `/register`} />
        <Button className={styles.Button} label="Alterar dados" onClick={() => window.location.href = `/register`} />

      </div>
    </div>
  );
};

export default profilePage;