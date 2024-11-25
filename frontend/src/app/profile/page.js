'use client'
import { useAuth } from "@/context/AuthContext";
import styles from "./profile.module.css";
import { Button } from 'primereact/button';
import ModalDisciplineRegistration from "@/components/Modal/ModalDiscipline/modal";
import { useState } from "react";


const profilePage = () => {
  const { user } = useAuth();
  const [modal, setModal] = useState(false);
  const isStudent = user?.type === 'Estudante';
  console.log(user);
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
        {!isStudent && (
          <>
            {((user?.type === 'Coordenador' || user?.type === 'Ensino') && user?.is_verified) && (
              <>
                <Button className={styles.Button} label="Lista de usuários" onClick={() => window.location.href = `/usersList`} />
                <Button className={styles.Button} label="Edital" onClick={() => window.location.href = `/notice`} />
                <Button className={styles.Button} label="Cadastrar Disciplina" onClick={() => setModal(true)} />
              </>
            )}
          </>
        )}
        {user?.type !== 'Professor' && (
          <>
            <Button className={styles.Button} label="Fazer solicitação" onClick={() => window.location.href = `/requests/requestForm`} />
          </>
        )}
        <Button className={styles.Button} label="Listar solicitações abertas" onClick={() => window.location.href = `/requests`} />
        <Button className={styles.Button} label="Alterar dados" onClick={() => window.location.href = `/register`} />
      </div>
      {modal && <ModalDisciplineRegistration onClose={() => setModal(false)} />}
    </div>
  );
};

export default profilePage;