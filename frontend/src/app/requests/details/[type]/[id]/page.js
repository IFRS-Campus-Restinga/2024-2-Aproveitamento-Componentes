"use client";

import {useEffect, useRef, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {default as Stepper} from "@/components/Stepper/stepper";
import styles from "./details.module.css";
import {baseURL} from "@/libs/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faClock, faEdit, faSave, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Button} from 'primereact/button';
import {getEnumIndexByValue} from "@/app/requests/status";

const Details = () => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedKnowledge, setEditedKnowledge] = useState("");
    const [editedCourseWorkload, setEditedCourseWorkload] = useState("");
    const [editedCourseStudiedWorkload, setEditedCourseStudiedWorkload] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [disableReactivity, setDisableReactivity] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const user = useAuth();
    const editableRef = useRef(null);
    const segments = pathname.split("/");
    const id = segments.at(-1);
    const type = segments.at(-2);
    const role = user.user.type;
    let [cursorPosition, setCursorPosition] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!disableReactivity && id && type) {
            const fetchDetails = async () => {
                try {
                    const response = await fetch(`${baseURL}/forms/${type}/${id}/`);
                    if (!response.ok) throw new Error("Erro ao buscar detalhes");
                    const data = await response.json();
                    setDetails(data);
                    setEditedKnowledge(data.previous_knowledge || "");
                    setEditedCourseWorkload(data.course_workload || "");
                    setEditedCourseStudiedWorkload(data.course_studied_workload || "");
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

    const approveRequest = async (status) => {
        try {
            const response = await fetch(`${baseURL}/forms/${type}/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: status,
                }),
            });

            if (!response.ok) throw new Error("Erro ao aprovar solicitação");

            const updatedDetails = await response.json();
            setDetails(updatedDetails);
        } catch (error) {
            setError(error.message);
        }
    };

    const rejectRequest = async (status) => {
        try {
            const response = await fetch(`${baseURL}/forms/${type}/${id}/`, {
                method: "PATCH",  // Usando PATCH para atualizar a solicitação
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: status,  // O status para "Rejeitado pelo Ensino"
                }),
            });

            if (!response.ok) throw new Error("Erro ao rejeitar solicitação");

            const updatedDetails = await response.json();
            setDetails(updatedDetails);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setDisableReactivity(!isEditing);
    };

    const handleInput = (e, field) => {
        let newText = e.currentTarget.textContent || "";
        const selection = window.getSelection();
        let range;
        if (selection && selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
        }
        cursorPosition = range ? range.startOffset : 0;
        setCursorPosition(cursorPosition);
        if (field === 'course_workload' || field === 'course_studied_workload') {
            newText = newText.replace(/[^0-9]/g, '');
        }
        if (newText.length > 255) {
            newText = newText.slice(0, 255);
            e.currentTarget.textContent = newText;
        }
        if (field === 'course_workload') {
            setEditedCourseWorkload(newText);
            setHasChanges(newText !== details.course_workload);
        } else if (field === 'course_studied_workload') {
            setEditedCourseStudiedWorkload(newText);
            setHasChanges(newText !== details.course_studied_workload);
        } else {
            setEditedKnowledge(newText);
            setHasChanges(newText !== details.previous_knowledge);
        }
        requestAnimationFrame(() => {
            if (inputRef.current && inputRef.current.firstChild) {
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStart(inputRef.current.firstChild, Math.min(cursorPosition, inputRef.current.firstChild.textContent.length));
                range.setEnd(inputRef.current.firstChild, Math.min(cursorPosition, inputRef.current.firstChild.textContent.length));
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    }


    const handleSave = async () => {
        try {
            const response = await fetch(`${baseURL}/forms/${type}/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    previous_knowledge: editedKnowledge,
                    course_workload: editedCourseWorkload,
                    course_studied_workload: editedCourseStudiedWorkload,
                }),
            });
            if (!response.ok) throw new Error("Erro ao salvar alterações");
            setHasChanges(false);
            setIsEditing(false);
            setDisableReactivity(false);
            setDetails((prevDetails) => ({
                ...prevDetails,
                previous_knowledge: editedKnowledge,
                course_workload: editedCourseWorkload,
                course_studied_workload: editedCourseStudiedWorkload,
            }));
        } catch (error) {
            setError("Erro ao salvar alterações");
        }
    };

    const handleBack = () => {
        router.push("/requests");
    };

    const getStatusProps = (status, stepIndex) => {
        const index = getEnumIndexByValue(status);
        if (index === stepIndex - 1) {
            return {color: "red", icon: faTimes, label: "Rejeitado"};
        } else if (stepIndex < index) {
            return {color: "green", icon: faCheck, label: "Aprovado"};
        } else {
            return {color: "yellow", icon: faClock, label: "Pendente"};
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.center_title}>Detalhes da Solicitação</h1>
            {details ? (
                <div>
                    <Stepper currentStep={details.status_display}/>
                    <div className={styles.analysis}>
                        <h1 className={styles.center_title}>Análise do Ensino</h1>
                        <div className={styles.columns}>
                            <div className={styles.infoColumn}>
                                <p className={styles.info}><strong>Aluno: </strong>{details.student_name}</p>
                                <p className={styles.info}><strong>E-mail: </strong>{details.student_email}</p>
                                <p className={styles.info}><strong>Matrícula: </strong>{details.student_matricula}
                                </p>
                                <p className={styles.info}><strong>Curso: </strong>{details.student_course}</p>
                                <p className={styles.info}><strong>Componente
                                    curricular: </strong>{details.discipline_name}
                                </p>

                                {type === "knowledge-certifications" && (
                                    <div className={styles.infoField}>
                                        <strong className={styles.info}>Experiência anterior: </strong>
                                        <span
                                            ref={editableRef}
                                            contentEditable={isEditing}
                                            suppressContentEditableWarning={true}
                                            className={`${styles.editableSpan} ${isEditing ? styles.editing : ''}`}
                                            onInput={(e) => handleInput(e, 'previous_knowledge')}
                                        >
                                    {editedKnowledge}
                                </span>
                                        {role === "Estudante" && details.status_display === "Solicitação Criada" && (
                                            <>
                                                <FontAwesomeIcon icon={faEdit} onClick={handleEditToggle}
                                                                 className={`${styles.iconSpacing} ${styles.editIcon}`}/>
                                                {isEditing && hasChanges && (
                                                    <FontAwesomeIcon icon={faSave} onClick={handleSave}
                                                                     className={`${styles.iconSpacing} ${styles.saveIcon}`}/>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {type === "recognition-forms" && (
                                    <>
                                        <div className={styles.infoField}>
                                            <strong className={styles.info}>Carga horária: </strong>
                                            <span
                                                ref={editableRef}
                                                contentEditable={isEditing}
                                                suppressContentEditableWarning={true}
                                                className={`${styles.editableSpan} ${isEditing ? styles.editing : ''}`}
                                                onInput={(e) => handleInput(e, 'course_workload')}
                                            >
                                        {editedCourseWorkload}
                                    </span>
                                            {role === "Estudante" && details.status_display === "Solicitação Criada" && (
                                                <>
                                                    <FontAwesomeIcon icon={faEdit} onClick={handleEditToggle}
                                                                     className={`${styles.iconSpacing} ${styles.editIcon}`}/>
                                                    {isEditing && hasChanges && (
                                                        <FontAwesomeIcon icon={faSave} onClick={handleSave}
                                                                         className={`${styles.iconSpacing} ${styles.saveIcon}`}/>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className={styles.infoField}>
                                            <strong className={styles.info}>Carga horária efetiva: </strong>
                                            <span
                                                ref={editableRef}
                                                contentEditable={isEditing}
                                                suppressContentEditableWarning={true}
                                                className={`${styles.editableSpan} ${isEditing ? styles.editing : ''}`}
                                                onInput={(e) => handleInput(e, 'course_studied_workload')}
                                            >
                                        {editedCourseStudiedWorkload}
                                    </span>
                                            {role === "Estudante" && details.status_display === "Solicitação Criada" && (
                                                <>
                                                    <FontAwesomeIcon icon={faEdit} onClick={handleEditToggle}
                                                                     className={`${styles.iconSpacing} ${styles.editIcon}`}/>
                                                    {isEditing && hasChanges && (
                                                        <FontAwesomeIcon icon={faSave} onClick={handleSave}
                                                                         className={`${styles.iconSpacing} ${styles.saveIcon}`}/>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={styles.actionColumn}>
                                <div
                                    className={`${styles.statusContainer} ${styles[getStatusProps(details.status_display, 3).color]}`}>
                                    <strong>Status: </strong>
                                    <div className={styles.statusButton}>
                                        <FontAwesomeIcon icon={getStatusProps(details.status_display, 3).icon}/>
                                        {getStatusProps(details.status_display, 3).label}
                                    </div>
                                </div>

                                {/*role === "Ensino" && */details.status_display === "Solicitação Criada" && (
                                    <div className={styles.actionButtons}>
                                        <Button label="Aprovar" icon="pi pi-check" onClick={approveRequest("CRE")}
                                                className="p-button-success"/>
                                        <Button label="Rejeitar" icon="pi pi-times" onClick={rejectRequest("RJ_CRE")}
                                                className="p-button-danger"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.analysis}>
                        <h1 className={styles.center_title}>Análise do Coordenador</h1>
                        <div className={styles.columns}>
                            <div className={styles.infoColumn}>
                                <p className={styles.info}><strong>Parecer do
                                    coordenador: </strong>{details.coordinator_feedback ? details.coordinator_feedback : "Pendente"}
                                </p>
                            </div>
                            <div className={styles.actionColumn}>
                                <div
                                    className={`${styles.statusContainer} ${styles[getStatusProps(details.status_display, 5).color]}`}>
                                    <strong>Status: </strong>
                                    <div className={styles.statusButton}>
                                        <FontAwesomeIcon icon={getStatusProps(details.status_display, 5).icon}/>
                                        {getStatusProps(details.status_display, 5).label}
                                    </div>
                                </div>

                                {/*role === "Coordenador" && */details.status_display === "Em análise do Ensino" && (
                                    <div className={styles.actionButtons}>
                                        <Button label="Aprovar" icon="pi pi-check" onClick={approveRequest("COORD")}
                                                className="p-button-success"/>
                                        <Button label="Rejeitar" icon="pi pi-times" onClick={rejectRequest("RJ_COORD")}
                                                className="p-button-danger"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.analysis}>
                        <h1 className={styles.center_title}>Marcar Prova</h1>
                    </div>
                    <div className={styles.analysis}>
                        <h1 className={styles.center_title}>Análise do Professor</h1>
                    </div>
                </div>
            ) : (
                <div>Nenhum detalhe disponível</div>
            )}
            <Button label="Voltar" onClick={handleBack} className={styles.backButton}/>
        </div>
    );
};

export default Details;
