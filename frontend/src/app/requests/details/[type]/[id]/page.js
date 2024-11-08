"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { default as Stepper } from "@/components/Stepper/stepper";
import styles from "./details.module.css";
import { baseURL } from "@/libs/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button } from 'primereact/button';

const Details = () => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedKnowledge, setEditedKnowledge] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [disableReactivity, setDisableReactivity] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const user = useAuth();
    const editableRef = useRef(null);
    const segments = pathname.split("/");
    const id = segments.at(-1);
    const type = segments.at(-2);

    useEffect(() => {
        if (!disableReactivity && id && type) {
            const fetchDetails = async () => {
                try {
                    const response = await fetch(`${baseURL}/forms/${type}/${id}/`);
                    if (!response.ok) throw new Error("Erro ao buscar detalhes");
                    const data = await response.json();
                    setDetails(data);
                    setEditedKnowledge(data.previous_knowledge || "");
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchDetails();
        } else {
            setLoading(false);
        }
    }, [pathname, disableReactivity]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setDisableReactivity(!isEditing);
    };

const handleInput = (e) => {
    let newText = e.currentTarget.textContent || "";
    if (newText.length > 255) {
        newText = newText.slice(0, 255);
        e.currentTarget.textContent = newText;
    }
    setEditedKnowledge(newText);
    setHasChanges(newText !== details.previous_knowledge);
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editableRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
};


    const handleSave = async () => {
        try {
            const response = await fetch(`${baseURL}/forms/${type}/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ previous_knowledge: editedKnowledge }),
            });
            if (!response.ok) throw new Error("Erro ao salvar alterações");
            setHasChanges(false);
            setIsEditing(false);
            setDisableReactivity(false);
            setDetails((prevDetails) => ({
                ...prevDetails,
                previous_knowledge: editedKnowledge,
            }));
        } catch (error) {
            setError("Erro ao salvar alterações");
        }
    };

    const handleBack = () => {
        router.push(`${baseURL}/requests`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.center_title}>Detalhes da Solicitação</h1>
            {details ? (
                <div>
                    <Stepper currentStep={details.status_display}/>
                    <h1 className={styles.center_title}>Análise do Ensino</h1>
                    <p className={styles.info}><strong>Aluno: </strong>{details.student_name}</p>
                    <p className={styles.info}><strong>E-mail: </strong>{details.student_email}</p>
                    <p className={styles.info}><strong>Matrícula: </strong>{details.student_matricula}</p>
                    <p className={styles.info}><strong>Curso: </strong>{details.student_course}</p>
                    <p className={styles.info}><strong>Componente curricular: </strong>{details.discipline_name}</p>
                    {type === "knowledge-certifications" && (
                        <div className={styles.info}>
                            <strong>Experiência anterior: </strong>
                            <span
                                ref={editableRef}
                                contentEditable={isEditing}
                                suppressContentEditableWarning={true}
                                className={`${styles.editableSpan} ${isEditing ? styles.editing : ''}`}
                                onInput={handleInput}
                            >
                                {editedKnowledge}
                            </span>
                            {details.status_display === "Solicitação Criada" && (
                                <FontAwesomeIcon icon={faEdit} onClick={handleEditToggle}/>
                            )}
                        </div>
                    )}
                    {details.status_display === "Solicitação Criada" && hasChanges && (
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Salvar Alterações
                        </Button>
                    )}
                    <Button variant="outlined" color="secondary" onClick={handleBack} className={styles.backButton}>
                        Voltar para Listagem
                    </Button>
                </div>
            ) : (
                <p>Nenhum detalhe encontrado.</p>
            )}
        </div>
    );
};

export default Details;
