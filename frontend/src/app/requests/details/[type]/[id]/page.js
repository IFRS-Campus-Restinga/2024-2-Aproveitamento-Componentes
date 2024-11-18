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
import RequestService from "@/services/RequestService";

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

    const handleDownloadAttachment = async (attachmentId) => {
        await RequestService.DownloadAttachment(attachmentId);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setDisableReactivity(!isEditing);
    };

    const handleInput = (e, field) => {
        let newValue = e.target.textContent;

        if (field === 'course_workload' || field === 'course_studied_workload') {
            newValue = newValue.replace(/[^0-9]/g, '');
        }

        if (newValue.length > 255) {
            newValue = newValue.slice(0, 255);
            e.currentTarget.textContent = newValue;
        }

        if ((field === 'previous_knowledge' && newValue !== details.previous_knowledge) ||
            (field === 'course_workload' && newValue !== details.course_workload) ||
            (field === 'course_studied_workload' && newValue !== details.course_studied_workload)) {
            setHasChanges(true);
        }
    };


    const handleSave = async () => {
        try {
            let body;
            if (type === "knowledge-certifications") {
                body = JSON.stringify({
                    previous_knowledge: editableRef.current.textContent, // Pegue o valor do DOM.
                });
            } else {
                body = JSON.stringify({
                    course_workload: editedCourseWorkload,
                    course_studied_workload: editedCourseStudiedWorkload,
                });
            }

            const response = await fetch(`${baseURL}/forms/${type}/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            });

            if (!response.ok) throw new Error("Erro ao salvar alterações");

            setHasChanges(false);
            setIsEditing(false);
            setDisableReactivity(false);

            // Atualize o estado React apenas após o salvamento.
            setDetails((prevDetails) => ({
                ...prevDetails,
                previous_knowledge: editableRef.current.textContent,
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
        if (index === stepIndex + 1) {
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
                                {details.attachments && details.attachments.length > 0 && (
                                    <div className={styles.attachmentsSection}>
                                        <h3>Anexos</h3>
                                        <ul className={styles.attachmentsList}>
                                            {details.attachments.map((attachment) => (
                                                <li key={attachment.id} className={styles.attachmentItem}>
                                                    <div className={styles.attachmentItemContent}>
                                                        <span>{attachment.file_name}</span>
                                                        <Button
                                                            icon="pi pi-download"
                                                            className="p-button-text p-button-rounded"
                                                            onClick={() => handleDownloadAttachment(attachment.id)}
                                                            tooltip="Baixar Anexo"
                                                        />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

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
                                        {role === "Estudante" && details.status_display === "Em análise do Ensino" && (
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
                                            {role === "Estudante" && details.status_display === "Em análise do Ensino" && (
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
                                            {role === "Estudante" && details.status_display === "Em análise do Ensino" && (
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
                                    className={`${styles.statusContainer} ${styles[getStatusProps(details.status_display, 0).color]}`}>
                                    <strong>Status: </strong>
                                    <div className={styles.statusButton}>
                                        <FontAwesomeIcon icon={getStatusProps(details.status_display, 0).icon}/>
                                        {getStatusProps(details.status_display, 0).label}
                                    </div>
                                </div>

                                {/*role === "Ensino" && */details.status_display === "Em análise do Ensino" && (
                                    <div className={styles.actionButtons}>
                                        <Button label="Aprovar" icon="pi pi-check"
                                                onClick={() => approveRequest("COORD")}
                                                className="p-button-success"/>
                                        <Button label="Rejeitar" icon="pi pi-times"
                                                onClick={() => rejectRequest("RJ_CRE")}
                                                className="p-button-danger"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {getEnumIndexByValue(details.status_display) >= 2 && (<div className={styles.analysis}>
                            <h1 className={styles.center_title}>Análise do Coordenador</h1>
                            <div className={styles.columns}>
                                <div className={styles.infoColumn}>
                                    <p className={styles.info}><strong>Parecer do
                                        coordenador: </strong>{details.coordinator_feedback ? details.coordinator_feedback : "Pendente"}
                                    </p>
                                </div>
                                <div className={styles.actionColumn}>
                                    <div
                                        className={`${styles.statusContainer} ${styles[getStatusProps(details.status_display, 2).color]}`}>
                                        <strong>Status: </strong>
                                        <div className={styles.statusButton}>
                                            <FontAwesomeIcon icon={getStatusProps(details.status_display, 2).icon}/>
                                            {getStatusProps(details.status_display, 2).label}
                                        </div>
                                    </div>

                                    {/*role === "Coordenador" && */details.status_display === "Em análise do Coordenador" && (
                                        <div className={styles.actionButtons}>
                                            <Button label="Aprovar" icon="pi pi-check"
                                                    onClick={() => approveRequest("PROF")}
                                                    className="p-button-success"/>
                                            <Button label="Rejeitar" icon="pi pi-times"
                                                    onClick={() => rejectRequest("RJ_COORD")}
                                                    className="p-button-danger"/>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {role != "Estudante" && (
                        <div className={styles.analysis}>
                            <h1 className={styles.center_title}>Marcar Prova</h1>
                        </div>
                    )}
                    {getEnumIndexByValue(details.status_display) >= 4 && (<div className={styles.analysis}>
                            <h1 className={styles.center_title}>Análise do Professor</h1>
                        </div>
                    )}
                </div>
            ) : (
                <div>Nenhum detalhe disponível</div>
            )}
            <Button label="Voltar" onClick={handleBack} className={styles.backButton}/>
        </div>
    );
};

export default Details;
