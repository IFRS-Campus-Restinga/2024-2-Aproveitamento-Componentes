import {useEffect, useState} from "react";
import styles from "./modalCourse.module.css";
import {Button} from "../../Button/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {courseCreate, courseEdit} from "@/services/CourseService";
import {UserList} from "@/services/AuthService";
import {DisciplineList, GetDiscipline} from "@/services/DisciplineService";
import {apiClient} from "@/libs/api";

const ModalCourse = ({onClose, editData = null}) => {
    const [courseName, setCourseName] = useState(editData ? editData.name : "");
    const [selectedProfessors, setSelectedProfessors] = useState(editData ? editData.professors : [],);
    const [selectedDisciplines, setSelectedDisciplines] = useState(editData ? editData.disciplines : [],);
    const [selectedCoordinator, setSelectedCoordinator] = useState(editData ? editData.coordinator_id :null);
    const [availableDisciplines, setAvailableDisciplines] = useState([]);
    const [availableProfessors, setAvailableProfessors] = useState([]);
    const [availableCoordinators, setAvailableCoordinators] = useState([]);
    const [existingCoordinator] = useState(editData ? editData.coordinator : null,);

    useEffect(() => {
        // Preenche os dados ao editar
        if (editData) {
            setCourseName(editData.name);

            const fetchProfessorNames = async () => {
                try {
                    const users = await UserList();
                    const professors = users.filter((user) =>
                        /*(user.servant_type === "Professor" || user.servant_type === "Coordenador") &&*/
                        editData.professors.includes(user.id),
                    );
                    setSelectedProfessors(professors);
                } catch (error) {
                    console.error("Erro ao buscar professores associados:", error);
                }
            };

            const fetchDisciplineNames = async () => {
                if (editData.disciplines.length > 0) {
                    const disciplineData = await Promise.all(
                        editData.disciplines.map(async (disciplineId) => {
                            const discipline = await GetDiscipline(disciplineId);
                            return discipline;
                        }),
                    );
                    setSelectedDisciplines(disciplineData);
                }
            };

            fetchDisciplineNames();
            fetchProfessorNames();
        }
        const fetchAvailableCoordinators = async () => {
            apiClient
                .get("/users/list", {
                    params: {
                        user_type: "Coordenador" || "Professor",
                    },
                })
                .then((response) => {
                    setAvailableCoordinators(response.data);
                });
        };
        // Preenche professores disponíveis
        const fetchAvailableProfessors = async () => {
            try {
                const users = await UserList();
                const professors = users.filter(
                    (user) => user.servant_type === "Professor" || user.servant_type === "Coordenador",
                );
                setAvailableProfessors(professors);
            } catch (error) {
                console.error("Erro ao buscar professores disponíveis:", error);
            }
        };

        // Preenche disciplinas disponíveis
        const fetchAvailableDisciplines = async () => {
            try {
                const disciplines = await DisciplineList();
                setAvailableDisciplines(disciplines);
            } catch (error) {
                console.error("Erro ao buscar disciplinas disponíveis:", error);
            }
        };

        fetchAvailableCoordinators();
        fetchAvailableDisciplines();
        fetchAvailableProfessors();
    }, [editData]);

    const handleRemoveProfessor = (prof) => {
        setSelectedProfessors(
            (prevProfessors) => prevProfessors.filter((p) => p.id !== prof.id), // Remove o professor pelo ID
        );
    };

    const handleAddProfessors = (professorId) => {
        if (!professorId) return;

        const selectedProfessor = availableProfessors.find(
            (prof) => prof.id.toString() === professorId,
        );

        if (
            selectedProfessor &&
            !selectedProfessors.some((prof) => prof.id === selectedProfessor.id)
        ) {
            setSelectedProfessors((prev) => [...prev, selectedProfessor]);
        }
    };

    const handleRemoveDiscipline = (disc) => {
        setSelectedDisciplines((prevDisciplines) =>
            prevDisciplines.filter((d) => d.id !== disc.id),
        );
    };

    const handleAddDiscipline = (disciplineId) => {
        if (!disciplineId) return;

        const selectedDiscipline = availableDisciplines.find(
            (disc) => disc.id.toString() === disciplineId,
        );

        if (
            selectedDiscipline &&
            !selectedDisciplines.some((disc) => disc.id === selectedDiscipline.id)
        ) {
            setSelectedDisciplines((prev) => [...prev, selectedDiscipline]);
        }
    };

    const handleSelectCoordinator = (coordinator) => {
        setSelectedCoordinator(Number(coordinator));
        console.log(coordinator);

    };

    const handleSubmit = async () => {
        console.log("Handle submit foi chamado");
        console.log(selectedCoordinator)
        const courseData = {
            name: courseName,
            professors: selectedProfessors.map((prof) => prof.id), // Apenas IDs
            disciplines: selectedDisciplines.map((disc) => disc.id), // Apenas UUIDs
            coordinator_id: selectedCoordinator ? selectedCoordinator : null,
        };

        console.log(courseData);
        try {
            if (editData) {
                await courseEdit(editData.id, courseData);
            } else {
                await courseCreate(courseData);
            }
            onClose();
            window.location.reload();
        } catch (error) {
            console.log("Erro ao salvar o curso:", error);
        }
    };

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <label style={{fontWeight: "700", fontSize: "20px"}}>
                    Nome do Curso
                </label>
                <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Nome do curso"
                    className={styles.courseInput}
                />

                <div className={styles.section}>
                    <label style={{fontWeight: "700"}}>Coordenador</label>
                    <div className={styles.selectedItems}>
                        <select onChange={(e) => handleSelectCoordinator(e.target.value)}>
                            <option value="" disabled={!!existingCoordinator}>
                                Selecione um Coordenador
                            </option>
                            {existingCoordinator && (
                                <option
                                    key={existingCoordinator.id}
                                    value={existingCoordinator.id}
                                >
                                    {existingCoordinator.name}
                                </option>
                            )}
                            {availableCoordinators
                                .filter(
                                    (coordinator) =>
                                        !existingCoordinator ||
                                        coordinator.id !== existingCoordinator.id,
                                )
                                .map((coordinator) => (
                                    <option key={coordinator.id} value={coordinator.id}>
                                        {coordinator.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
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
                </div>
                <div>
                    <Button color="#af0a0a" onClick={onClose}>
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalCourse;
