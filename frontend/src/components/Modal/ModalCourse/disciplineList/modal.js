import React, {useEffect, useState} from "react";
import styles from "./modalDisciplineList.module.css";
import {GetDiscipline, DisciplineList} from '@/services/DisciplineService';
import {UserList} from "@/services/AuthService";
import {courseCreate, courseEdit} from "@/services/CourseService";

const ModalDisciplineList = ({course, onClose}) => {
    const [courseName, setCourseName] = useState(course ? course.name : "");
    const [selectedDisciplines, setSelectedDisciplines] = useState(course ? course.disciplines : []);
    const [availableDisciplines, setAvailableDisciplines] = useState([]);

    useEffect(() => {
        // Preenche os dados ao editar
        if (course) {
            setCourseName(course.name);
            const fetchDisciplineNames = async () => {
                if (course.disciplines.length > 0) {
                    const disciplineData = await Promise.all(
                        course.disciplines.map(async (disciplineId) => {
                            const discipline = await GetDiscipline(disciplineId);
                            return discipline;
                        })
                    );
                    setSelectedDisciplines(disciplineData);
                }
            };

            fetchDisciplineNames();
        }

        // Preenche disciplinas disponíveis
        const fetchAvailableDisciplines = async () => {
            try {
                const disciplines = await DisciplineList();
                setAvailableDisciplines(disciplines);
            } catch (error) {
                console.error("Erro ao buscar disciplinas disponíveis:", error);
            }
        };

        fetchAvailableDisciplines();
    }, [course]);


    /*const handleRemoveDiscipline = (disc) => {
        setSelectedDisciplines((prevDisciplines) =>
            prevDisciplines.filter((d) => d.id !== disc.id)
        );
    };

    const handleAddDiscipline = (disciplineId) => {
        if (!disciplineId) return;

        const selectedDiscipline = availableDisciplines.find(
            (disc) => disc.id.toString() === disciplineId
        );

        if (selectedDiscipline && !selectedDisciplines.some((disc) => disc.id === selectedDiscipline.id)) {
            setSelectedDisciplines((prev) => [...prev, selectedDiscipline]);
        }
    };*/


    /*const handleSubmit = async () => {
        console.log("Handle submit foi chamado");
        const courseData = {
            name: courseName,
            professors: selectedProfessors.map((prof) => prof.id), // Apenas IDs
            disciplines: selectedDisciplines.map((disc) => disc.id), // Apenas UUIDs
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
    };*/

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Disciplinas de {course.name}</h2>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Carga Horária</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedDisciplines.map((disc) => (
                        <tr key={disc.id}>
                            <td>{disc.name ?? "N/A"}</td>
                            <td>{disc.workload}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <button className={styles.closeButton} onClick={onClose}>
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default ModalDisciplineList;
