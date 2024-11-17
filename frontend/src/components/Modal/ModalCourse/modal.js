import { useState, useEffect } from "react";
import styles from "./modalCourse.module.css";
import { Button } from "../../Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { courseCreate, courseEdit } from "@/services/CourseService";
import { disciplineList, getDisciplineById } from "@/services/DisciplineService";
import { UserList, getUserById } from "@/services/AuthService";

const ModalCourse = ({ onClose, editData = null }) => {
  const [courseName, setCourseName] = useState(editData ? editData.name : "");
  const [selectedProfessors, setSelectedProfessors] = useState(editData ? editData.professors : []);
  const [selectedDisciplines, setSelectedDisciplines] = useState(editData ? editData.disciplines : []);
  const [availableDisciplines, setAvailableDisciplines] = useState([]);
  const [availableProfessors, setAvailableProfessors] = useState([]);

  useEffect(() => {
    if (editData) {
      setCourseName(editData.name);
      const fetchProfessorNames = async () => {
        if (editData && editData.professors.length > 0) {
          const professorData = await Promise.all(
            editData.professors.map(async (userId) => {
              const professor = await getUserById(userId);
              return professor;
            })
          );
          setSelectedProfessors(professorData);
        }
      };
      const fetchDisciplineNames = async () => {
        if (editData && editData.disciplines.length > 0) {
          const disciplineData = await Promise.all(
            editData.disciplines.map(async (disciplineId) => {
              const discipline = await getDisciplineById(disciplineId);
              return discipline;
            })
          );
          setSelectedDisciplines(disciplineData);
        }
      };

    fetchDisciplineNames();
    fetchProfessorNames();
    }
  }, [editData]);

  // Carrega todas os professores disponíveis para o select
  useEffect(() => {
    const loadAvailableProfessors = async () => {
      const allProfessors = await UserList();
      setAvailableProfessors(allProfessors);
    };

    loadAvailableProfessors();
  }, []);

  const handleAddProfessors = async (userId) => {
    const professor = await getUserById(userId);
    if (!selectedProfessors.some((disc) => disc.id === professor.id)) {
      setSelectedProfessors([...selectedProfessors, professor]);
    }
  };

  const handleRemoveProfessor = (professor) => {
    setSelectedProfessors(
      selectedProfessors.filter((disc) => disc.id !== professor.id)
    );
  };

  // Carrega todas as disciplinas disponíveis para o select
  useEffect(() => {
    const loadAvailableDisciplines = async () => {
      const allDisciplines = await disciplineList();
      setAvailableDisciplines(allDisciplines);
    };

    loadAvailableDisciplines();
  }, []);

  const handleAddDiscipline = async (disciplineId) => {
    const discipline = await getDisciplineById(disciplineId);
    if (!selectedDisciplines.some((disc) => disc.id === discipline.id)) {
      setSelectedDisciplines([...selectedDisciplines, discipline]);
    }
  };

  const handleRemoveDiscipline = (discipline) => {
    setSelectedDisciplines(
      selectedDisciplines.filter((disc) => disc.id !== discipline.id)
    );
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
        <label style={{fontWeight: "700", fontSize: "20px"}}>Nome do Curso</label>
        <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Nome do curso"
            className={styles.courseInput}
        />

        <div className={styles.section}>
          <label style={{fontWeight: "700"}}>Professores</label>
          <div className={styles.selectedItems}>
            {selectedProfessors.map((prof, index) => (
                <span key={index} className={styles.selectedItem}>
                  {prof.name}
                  <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleRemoveProfessor(prof)}
                      style={{cursor: "pointer", marginLeft: "5px"}}
                  />
              </span>
            ))}
          </div>
          <select onChange={(e) => handleAddProfessors(e.target.value)}>
            <option value="">Adicionar professor</option>
            {availableProfessors.map((professor) => (
                <option key={professor.id} value={professor.id}>
                  {professor.name}
                </option>
            ))}
          </select>
        </div>

        <div className={styles.section}>
          <label style={{fontWeight: "700"}}>Disciplinas</label>
          <div className={styles.selectedItems}>
            {selectedDisciplines.map((disc, index) => (
                <span key={index} className={styles.selectedItem}>
                  {disc.name}
                  <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleRemoveDiscipline(disc)}
                      style={{cursor: "pointer", marginLeft: "5px"}}
                  />
              </span>
            ))}
          </div>
          <select onChange={(e) => handleAddDiscipline(e.target.value)}>
            <option value="">Adicionar disciplina</option>
            {availableDisciplines.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
            ))}
          </select>
        </div>

        <div className={styles.buttonContainer}>
          <Button onClick={handleSubmit}>
            {editData ? "Salvar Alterações" : "Cadastrar"}
          </Button>
          <Button color="#af0a0a" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalCourse;
