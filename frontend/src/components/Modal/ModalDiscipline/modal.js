import { useEffect, useState } from "react";
import styles from "./modalDiscipline.module.css";
import { Button } from "../../Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { disciplines as initialDisciplines } from "@/mocks/dataMocks";
import DisciplineService from "@/services/DisciplineService";


const ModalDisciplineRegistration = ({ onClose }) => {
  const [previousComponent, setPreviousComponent] = useState("");
  const [discipline, setDiscipline] = useState([]);
  const [newDiscipline, setNewDiscipline] = useState({  // Estado para a nova disciplina a ser criada
    name: "",
    workload: "",
    syllabus: "",
    prerequisites: [],
    professors: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false); // Controla a exibição do formulário de cadastro
  
  // Função para excluir disciplina
  const DeleteDiscipline = async (uuid) => {
    try {
      const response = await DisciplineService.DeleteDiscipline(uuid);  // Usando uuid
      setDiscipline((prevDisciplines) => prevDisciplines.filter(discipline => discipline.id !== uuid));
      return response.data;
    } catch (err) {
      console.error("Erro ao excluir disciplina:", err);
      throw err;  // Repassando o erro para o handler no frontend
    }
  };

  // Função para criar uma nova disciplina
  const CreateDiscipline = async () => {
    try {
      const createdDiscipline = await DisciplineService.CreateDiscipline(newDiscipline);
      setDiscipline((prevDisciplines) => [...prevDisciplines, createdDiscipline]);  // Adiciona a nova disciplina à lista
      setNewDiscipline({
        name: "",
        workload: "",
        syllabus: "",
        prerequisites: [],
        professors: "",
      });
      setIsFormVisible(false);  // Fecha o formulário após a criação
    } catch (err) {
      console.error("Erro ao criar disciplina:", err);
    }
  };

  useEffect(() => {
      const fetchDiscipline = async () => {
        try {
          const data = await DisciplineService.DisciplineList();
          console.log(data);
          setDiscipline(data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchDiscipline();
    }, []);

    return (
      <div className={styles.modalBackground}>
        <div className={styles.modalContainer}>
          {!isFormVisible ? (
            <div>
              <Button type="button" onClick={() => setIsFormVisible(true)}>
                Cadastrar
              </Button>
              <div className={styles.scrollableTable}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Disciplinas cadastradas</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discipline.map((disciplines, index) => (
                      <tr key={index}>
                        <td>{disciplines.name ?? "N/A"}</td>
                        <td>
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ cursor: "pointer" }}
                            onClick={() => DeleteDiscipline(disciplines.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h3>Cadastro de Disciplina</h3>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Nome da Disciplina</label>
                <input
                  type="text"
                  value={newDiscipline.name}
                  onChange={(e) => setNewDiscipline({ ...newDiscipline, name: e.target.value })}
                  placeholder="Nome da disciplina"
                  className={styles.disciplineInput}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Carga Horária</label>
                <input
                  type="text"
                  value={newDiscipline.workload}
                  onChange={(e) => setNewDiscipline({ ...newDiscipline, workload: e.target.value })}
                  placeholder="Carga horária"
                  className={styles.disciplineInput}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Ementa</label>
                <textarea
                  value={newDiscipline.syllabus}
                  onChange={(e) => setNewDiscipline({ ...newDiscipline, syllabus: e.target.value })}
                  placeholder="Ementa da disciplina"
                  className={styles.disciplineInput}
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Professores</label>
                <input
                  type="text"
                  value={newDiscipline.professors}
                  onChange={(e) => setNewDiscipline({ ...newDiscipline, professors: e.target.value })}
                  placeholder="Professores responsáveis"
                  className={styles.disciplineInput}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button type="button" onClick={CreateDiscipline}>
                  Confirmar
                </Button>
                <Button type="button" color="#af0a0a" onClick={() => setIsFormVisible(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ModalDisciplineRegistration;
