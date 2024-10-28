import { useState } from "react";
import styles from "./modal.module.css";
import { Button } from "../Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { disciplines as initialDisciplines } from "@/mocks/dataMocks";

const ModalDisciplineRegistration = ({ onClose }) => {
  const [previousComponent, setPreviousComponent] = useState("");

  const deleteDiscipline = (name) => {
    //logica para excluir
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Nome da Disciplina
        </label>
        <input
          type="text"
          value={previousComponent}
          onChange={(e) => setPreviousComponent(e.target.value)}
          placeholder="Componente cursado anteriormente"
          className={styles.disciplineInput}
        />
        <Button type={"submit"}>Cadastrar</Button>
        <div className={styles.scrollableTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Disciplinas cadastradas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {initialDisciplines.map((disciplines, index) => (
                <tr key={index}>
                  <td>{disciplines.Name ?? "N/A"}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteDiscipline(disciplines.Name)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Button type="button" color="#af0a0a" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalDisciplineRegistration;
