import { useState, useEffect } from "react";
import styles from "./modalCourse.module.css";
import { Button } from "../../Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { courseCreate, courseEdit } from "@/services/CourseService";
import { servants as initialServants, disciplines as initialDisciplines } from "@/mocks/dataMocks";

const ModalCourse = ({ onClose, editData = null }) => {
  const [courseName, setCourseName] = useState(editData ? editData.name : "");
  const [selectedProfessors, setSelectedProfessors] = useState(editData ? editData.professors : []);
  const [selectedDisciplines, setSelectedDisciplines] = useState(editData ? editData.disciplines : []);

  useEffect(() => {
    if (editData) {
      setCourseName(editData.name);
      setSelectedProfessors(editData.professors);
      setSelectedDisciplines(editData.disciplines);
    }
  }, [editData]);

  const handleAddProfessor = (professor) => {
    if (!selectedProfessors.includes(professor)) {
      setSelectedProfessors([...selectedProfessors, professor]);
    }
  };

  const handleRemoveProfessor = (professor) => {
    setSelectedProfessors(selectedProfessors.filter((prof) => prof !== professor));
  };

  const handleAddDiscipline = (discipline) => {
    if (!selectedDisciplines.includes(discipline)) {
      setSelectedDisciplines([...selectedDisciplines, discipline]);
    }
  };

  const handleRemoveDiscipline = (discipline) => {
    setSelectedDisciplines(selectedDisciplines.filter((disc) => disc !== discipline));
  };

  const handleSubmit = async () => {
    const courseData = {
      name: courseName,
      professors: selectedProfessors.map((prof) => ({ id: prof.id })),
      disciplines: selectedDisciplines.map((disc) => ({ id: disc.id })),
    };

    try {
      if (editData) {
        await courseEdit(editData.id, courseData);
      } else {
        await courseCreate(courseData);
      }
      onClose();
    } catch (error) {
      console.log("Erro ao salvar o curso:", error);
    }
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>Nome do Curso</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="Nome do curso"
          className={styles.courseInput}
        />

        <div className={styles.section}>
          <label style={{ fontWeight: "700" }}>Professores</label>
          <div className={styles.selectedItems}>
            {selectedProfessors.map((prof, index) => (
              <span key={index} className={styles.selectedItem}>
                {prof.name}
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => handleRemoveProfessor(prof)}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                />
              </span>
            ))}
          </div>
          <select onChange={(e) => handleAddProfessor(e.target.value)}>
            <option value="">Adicionar professor</option>
            {initialServants.map((servant) => (
              <option key={servant.id} value={servant}>
                {servant.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.section}>
          <label style={{ fontWeight: "700" }}>Disciplinas</label>
          <div className={styles.selectedItems}>
            {selectedDisciplines.map((disc, index) => (
              <span key={index} className={styles.selectedItem}>
                {disc.name}
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => handleRemoveDiscipline(disc)}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                />
              </span>
            ))}
          </div>
          <select onChange={(e) => handleAddDiscipline(e.target.value)}>
            <option value="">Adicionar disciplina</option>
            {initialDisciplines.map((discipline) => (
              <option key={discipline.id} value={discipline}>
                {discipline.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.buttonContainer}>
          <Button onClick={handleSubmit}>{editData ? "Salvar Alterações" : "Cadastrar"}</Button>
          <Button color="#af0a0a" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalCourse;
