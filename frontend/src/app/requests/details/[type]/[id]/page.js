"use client";

import {apiClient, baseURL} from "@/libs/api";
import {useEffect, useRef, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {default as Stepper} from "@/components/Stepper/stepper";
import styles from "./details.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faClock, faEdit, faSave, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Button} from 'primereact/button';
import {getEnumIndexByValue} from "@/app/requests/status";
import RequestService from "@/services/RequestService";
import {TextField} from "@mui/material";

const Details = () => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingKnowledge, setIsEditingKnowledge] = useState(false);
    const [isEditingCourseWorkload, setisEditingCourseWorkload] = useState(false);
    const [isEditingCourseStudiedWorkload, setIsEditingCourseStudiedWorkload] = useState(false);
    const [isEditingTestScore, setIsEditingTestScore] = useState(false);
    const [editedKnowledge, setEditedKnowledge] = useState("");
    const [editedCourseWorkload, setEditedCourseWorkload] = useState("");
    const [editedSchedulingDate, setEditedSchedulingDate] = useState("");
    const [editedCourseStudiedWorkload, setEditedCourseStudiedWorkload] = useState("");
    const [editedCoordinatorFeedback, setEditedCoordinatorFeedback] = useState("")
    const [editedProfessorFeedback, setEditedProfessorFeedback] = useState("")
    const [editedTestScore, setEditedTestScore] = useState("")
    const [hasChangesKnowledge, setHasChangesKnowledge] = useState(false);
    const [hasChangesWorkload, setHasChangesWorkload] = useState(false);
    const [hasChangesStudiedWorkload, setHasChangesStudiedWorkload] = useState(false);
    const [hasChangesTestScore, setHasChangesTestScore] = useState(false);
    const [disableReactivity, setDisableReactivity] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const {user} = useAuth();
    const role = user.type;
    const editableRef = useRef(null);
    const segments = pathname.split("/");
    const id = segments.at(-1);
    const type = segments.at(-2);

    const fetchDetails = async () => {
        try {
            console.log('user' + user.name);
            const response = await apiClient.get(`${baseURL}/forms/${type}/${id}/`);
            if (!response.ok) throw new Error("Erro ao buscar detalhes");
            const data = await response.json();
            setDetails(data);
            // setEditedSchedulingDate((prev) => (prev ? prev : data.scheduling_date || ""));
            setEditedKnowledge((prev) => (prev ? prev : data.previous_knowledge || ""));
            setEditedCourseWorkload((prev) => (prev ? prev : data.course_workload || ""));
            setEditedCourseStudiedWorkload((prev) => (prev ? prev : data.course_studied_workload || ""));
            // setEditedCoordinatorFeedback((prev) => (prev ? prev : data.coordinator_feedback || ""));
            // setEditedProfessorFeedback((prev) => (prev ? prev : data.professor_feedback || ""));
            setEditedTestScore((prev) => (prev !== "" ? prev : data.test_score || ""));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!disableReactivity && id && type) {
            fetchDetails();
        } else {
            setLoading(false);
        }
    }, [pathname, disableReactivity]);

    const createStep = async (status) => {
        try {
            const formType = type === "knowledge-certifications" ? "certification_form" : "recognition_form";
            const body = JSON.stringify({
                status: status,
                [formType]: details.id
            });
            const response = await apiClient.post(`${baseURL}/forms/steps/`, body);

            if (!response.ok) throw new Error("Erro ao alterar solicitação");

            await fetchDetails();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDownloadAttachment = async (attachmentId) => {
        await RequestService.DownloadAttachment(attachmentId);
    };

    const handleEditToggleKnowledge = () => {
        setIsEditingKnowledge(!isEditingKnowledge);
        setDisableReactivity(!isEditingKnowledge);
    }
    const handleEditToggleCourseWorkload = () => {
        setisEditingCourseWorkload(!isEditingCourseWorkload);
        setDisableReactivity(!isEditingCourseWorkload);
    }
    const handleEditToggleCourseStudiedWorkload = () => {
        setIsEditingCourseStudiedWorkload(!isEditingCourseStudiedWorkload);
        setDisableReactivity(!isEditingCourseStudiedWorkload);
    }
    const handleEditToggleTestScore = () => {
        setIsEditingTestScore(!isEditingTestScore);
        setDisableReactivity(!isEditingTestScore);
    }

    const handleInput = (e, field) => {
        let newValue = e.target.textContent;

        if (field === 'course_workload' || field === 'course_studied_workload' || field === 'test_score') {
            newValue = newValue.replace(/[^0-9]/g, '');
        }

        if (newValue.length > 255) {
            newValue = newValue.slice(0, 255);
            e.currentTarget.textContent = newValue;
        }

        if (field === 'previous_knowledge') {
            setEditedKnowledge(newValue);
            if (newValue !== details.previous_knowledge) {
                setHasChangesKnowledge(true);
            }
        } else if (field === 'course_workload') {
            setEditedCourseWorkload(newValue);
            if (newValue !== details.course_workload) {
                setHasChangesWorkload(true);
            }
        } else if (field === 'course_studied_workload') {
            setEditedCourseStudiedWorkload(newValue);
            if (newValue !== details.course_studied_workload) {
                setHasChangesStudiedWorkload(true);
            }
        } else if (field === 'test_score') {
            setEditedTestScore(newValue);
            if (newValue !== details.test_score) {
                setHasChangesTestScore(true);
            }
        }

    };

    const handleSave = async (field) => {
        try {
            let updatedData;

            switch (field) {
                case 'previous_knowledge':
                    updatedData = {previous_knowledge: editedKnowledge};
                    break;
                case 'course_workload':
                    updatedData = {course_workload: editedCourseWorkload};
                    break;
                case 'course_studied_workload':
                    updatedData = {course_studied_workload: editedCourseStudiedWorkload};
                    break;
                case 'test_score':
                    updatedData = {test_score: editedTestScore};
                    break;
            }

            const body = JSON.stringify(updatedData);

            const response = await apiClient.patch(`${baseURL}/forms/${type}/${id}/`, body);

            if (!response.ok) throw new Error("Erro ao salvar alterações");

            switch (field) {
                case 'previous_knowledge':
                    setHasChangesKnowledge(false);
                    setIsEditingKnowledge(false);
                    break;
                case 'course_workload':
                    setHasChangesWorkload(false);
                    setisEditingCourseWorkload(false);
                    break;
                case 'course_studied_workload':
                    setHasChangesStudiedWorkload(false);
                    setIsEditingCourseStudiedWorkload(false);
                    break;
                case 'test_score':
                    setHasChangesTestScore(false);
                    setIsEditingTestScore(false);
                    break;
            }

            setDisableReactivity(false);

            setDetails((prevDetails) => ({
                ...prevDetails,
                ...updatedData,
            }));
        } catch (error) {
            setError("Erro ao salvar alterações");
        } finally {
            setEditedKnowledge("");
            setEditedCourseWorkload("");
            setEditedSchedulingDate("");
            setEditedCourseStudiedWorkload("");
            setEditedTestScore("");
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

    const handleDateChange = (e) => {
        const {value} = e.target;
        setEditedSchedulingDate(value);
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.center_title}>Detalhes da Solicitação</h1>
            {details ? (
                <div>
                    {details.status_display !== "Cancelado" ? (
                        <Stepper currentStep={details.status_display}/>
                    ) : (
                        <div className={styles.centered}>
                            <div
                                className={`${styles.statusContainer} ${styles.red}`}>
                                <strong>Status: </strong>
                                <div className={styles.statusButton}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                    {"Cancelado pelo aluno"}
                                </div>
                            </div>
                        </div>
                    )}
                    {role === "Estudante" && details.status_display === "Em análise do Ensino" && (
                        <div className={styles.centered}>
                            <Button label="Cancelar solicitação" icon="pi pi-times"
                                    onClick={() => createStep("CANCELED")}
                                    className="p-button-danger"/>
                        </div>
                    )}
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
                                            contentEditable={isEditingKnowledge}
                                            suppressContentEditableWarning={true}
                                            className={`${styles.editableSpan} ${isEditingKnowledge ? styles.editing : ''}`}
                                            onInput={(e) => handleInput(e, 'previous_knowledge')}
                                        >
                                    {details.previous_knowledge || "Pendente"}
                                </span>
                                        {role === "Estudante" && details.status_display === "Em análise do Ensino" && (
                                            <>
                                                <FontAwesomeIcon icon={faEdit} onClick={handleEditToggleKnowledge}
                                                                 className={`${styles.iconSpacing} ${styles.editIcon}`}/>
                                                {isEditingKnowledge && hasChangesKnowledge && (
                                                    <FontAwesomeIcon icon={faSave}
                                                                     onClick={() => handleSave('previous_knowledge')}
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
                                                contentEditable={isEditingCourseWorkload}
                                                suppressContentEditableWarning={true}
                                                className={`${styles.editableSpan} ${isEditingCourseWorkload ? styles.editing : ''}`}
                                                onInput={(e) => handleInput(e, 'course_workload')}
                                            >
                                        {details.course_workload || "Pendente"}
                                    </span>
                                            {role === "Estudante" && details.status_display === "Em análise do Ensino" && (
                                                <>
                                                    <FontAwesomeIcon icon={faEdit}
                                                                     onClick={handleEditToggleCourseWorkload}
                                                                     className={`${styles.iconSpacing} ${styles.editIcon}`}/>
                                                    {isEditingCourseWorkload && hasChangesWorkload && (
                                                        <FontAwesomeIcon icon={faSave}
                                                                         onClick={() => handleSave('course_workload')}
                                                                         className={`${styles.iconSpacing} ${styles.saveIcon}`}/>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className={styles.infoField}>
                                            <strong className={styles.info}>Carga horária efetiva: </strong>
                                            <span
                                                ref={editableRef}
                                                contentEditable={isEditingCourseStudiedWorkload}
                                                suppressContentEditableWarning={true}
                                                className={`${styles.editableSpan} ${isEditingCourseStudiedWorkload ? styles.editing : ''}`}
                                                onInput={(e) => handleInput(e, 'course_studied_workload')}
                                            >
                                        {details.course_studied_workload || "Pendente"}
                                    </span>
                                            {role === "Estudante" && details.status_display === "Em análise do Ensino" && (
                                                <>
                                                    <FontAwesomeIcon icon={faEdit}
                                                                     onClick={handleEditToggleCourseStudiedWorkload}
                                                                     className={`${styles.iconSpacing} ${styles.editIcon}`}/>
                                                    {isEditingCourseStudiedWorkload && hasChangesStudiedWorkload && (
                                                        <FontAwesomeIcon icon={faSave}
                                                                         onClick={() => handleSave('course_studied_workload')}
                                                                         className={`${styles.iconSpacing} ${styles.saveIcon}`}/>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            {details.status_display !== 'Cancelado' && (
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
                                                    onClick={() => createStep("COORD")}
                                                    className="p-button-success"/>
                                            <Button label="Rejeitar" icon="pi pi-times"
                                                    onClick={() => createStep("RJ_CRE")}
                                                    className="p-button-danger"/>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    {getEnumIndexByValue(details.status_display) >= 2 && (<div className={styles.analysis}>
                            <h1 className={styles.center_title}>Análise do Coordenador</h1>
                            <div className={styles.columns}>
                                <div className={styles.infoColumn}>
                                    <p className={styles.info}><strong>Parecer do
                                        coordenador: </strong>{details.coordinator_feedback || "Pendente"}
                                    </p>
                                </div>
                                <div className={styles.actionColumn}>
                                    {details.status_display !== 'Cancelado' && (
                                        <div
                                            className={`${styles.statusContainer} ${styles[getStatusProps(details.status_display, 2).color]}`}>
                                            <strong>Status: </strong>
                                            <div className={styles.statusButton}>
                                                <FontAwesomeIcon icon={getStatusProps(details.status_display, 2).icon}/>
                                                {getStatusProps(details.status_display, 2).label}
                                            </div>
                                        </div>
                                    )}
                                    {/*role === "Coordenador" && */details.status_display === "Em análise do Coordenador"
                                        && details.coordinator_feedback && (
                                            <div className={styles.actionButtons}>
                                                <Button label="Aprovar" icon="pi pi-check"
                                                        onClick={() => createStep("PROF")}
                                                        className="p-button-success"/>
                                                <Button label="Rejeitar" icon="pi pi-times"
                                                        onClick={() => createStep("RJ_COORD")}
                                                        className="p-button-danger"/>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    )}
                    {getEnumIndexByValue(details.status_display) >= 4 && (<div className={styles.analysis}>
                            <h1 className={styles.center_title}>Análise do Professor</h1>
                            <div className={styles.columns}>
                                <div className={styles.infoColumn}>
                                    {type === "knowledge-certifications" && !details.scheduling_date /* && role === "Professor"*/ && (
                                        <div className={styles.date_time_container}>
                                            <p className={styles.info}><strong>Agendar
                                                prova: </strong>
                                            </p>
                                            <TextField
                                                className={styles.date_time}
                                                type="datetime-local"
                                                name="schedulingDate"
                                                value={editedSchedulingDate}
                                                onChange={handleDateChange}
                                                fullWidth
                                                slotProps={{
                                                    htmlInput: {
                                                        min: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                                                    },
                                                }}
                                            />
                                            {editedSchedulingDate !== "" && (
                                                <div className={styles.iconSpacing}>
                                                    <FontAwesomeIcon icon={faSave} onClick={handleSave}
                                                                     className={`${styles.iconSpacing} ${styles.saveIcon}`}/>
                                                    <span className={styles.saveIcon}
                                                          onClick={handleSave}>Agendar</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {type === "knowledge-certifications" && details.scheduling_date && (
                                        <p className={styles.info}><strong>Data da
                                            prova: </strong>{details.scheduling_date
                                            ? new Date(details.scheduling_date).toLocaleString("pt-BR")
                                            : "Pendente"}
                                        </p>
                                    )}

                                    {type === "knowledge-certifications" && (
                                        <p className={styles.info}>
                                            <strong>Avaliação: </strong>
                                            <span
                                                ref={editableRef}
                                                contentEditable={isEditingTestScore}
                                                suppressContentEditableWarning={true}
                                                className={`${styles.editableSpan} ${isEditingTestScore ? styles.editing : ''}`}
                                                onInput={(e) => handleInput(e, 'test_score')}>
            {details.test_score || "Pendente"}
        </span>
                                            {/*role === "Professor" && */details.status_display === "Em análise do Professor" && (
                                                <>
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        onClick={handleEditToggleTestScore}
                                                        className={`${styles.iconSpacing} ${styles.editIcon}`}
                                                    />
                                                    {isEditingTestScore && hasChangesTestScore && (
                                                        <FontAwesomeIcon
                                                            icon={faSave}
                                                            onClick={() => handleSave('test_score')}
                                                            className={`${styles.iconSpacing} ${styles.saveIcon}`}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </p>
                                    )}

                                    <p className={styles.info}><strong>Parecer do
                                        professor: </strong>{details.professor_feedback || "Pendente"}
                                    </p>
                                </div>
                                <div className={styles.actionColumn}>
                                    {details.status_display !== 'Cancelado' && (
                                        <div
                                            className={`${styles.statusContainer} ${styles[getStatusProps(details.status_display, 4).color]}`}>
                                            <strong>Status: </strong>
                                            <div className={styles.statusButton}>
                                                <FontAwesomeIcon icon={getStatusProps(details.status_display, 4).icon}/>
                                                {getStatusProps(details.status_display, 4).label}
                                            </div>
                                        </div>
                                    )}
                                    {/*role === "Professor" && */details.status_display === "Em análise do Professor"
                                        && details.professor_feedback && (
                                            <div className={styles.actionButtons}>
                                                <Button label="Aprovar" icon="pi pi-check"
                                                        onClick={() => createStep("GRANTED")}
                                                        className="p-button-success"/>
                                                <Button label="Rejeitar" icon="pi pi-times"
                                                        onClick={() => createStep("RJ_PROF")}
                                                        className="p-button-danger"/>
                                            </div>
                                        )}
                                </div>
                            </div>
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
