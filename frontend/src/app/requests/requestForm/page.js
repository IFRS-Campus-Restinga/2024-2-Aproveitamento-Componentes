"use client";

import {useState} from "react";
import {useAuth} from "@/context/AuthContext";
import styles from "./requestForm.module.css";
import {Button} from "@/components/Button/button";
import {baseURL} from "@/libs/api";
import { FileUpload } from "primereact/fileupload";
import RequestService from "@/services/RequestService";

const CertificationRequestForm = () => {
    const [requestType, setRequestType] = useState("");
    const [previousKnowledge, setPreviousKnowledge] = useState("");
    const [courseWorkload, setCourseWorkload] = useState("");
    const [courseStudiedWorkload, setCourseStudiedWorkload] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [disciplineId, setDisciplineId] = useState("");
    const [disciplines, setDisciplines] = useState([]);
    const [attachment, setAttachment] = useState([]);
    const [status] = useState("CR");
    const {user} = useAuth();

    const courses = [
        {id: 1, name: "Curso de Engenharia"},
        {id: 2, name: "Curso de Medicina"},
        {id: 3, name: "Curso de Direito"},
    ];

    const disciplinesData = { // TODO REMOVER
        1: [
            {id: 'fc40c88d-65ae-41ca-bd19-89075f9b4ea3', name: "Matemática"},
            {id: 'fc40c88d-65ae-41ca-bd19-89075f9b4ea3', name: "Física"},
        ],
        2: [
            {id: 'fc40c88d-65ae-41ca-bd19-89075f9b4ea3', name: "Anatomia"},
            {id: 'fc40c88d-65ae-41ca-bd19-89075f9b4ea3', name: "Fisiologia"},
        ],
        3: [
            {id: 'fc40c88d-65ae-41ca-bd19-89075f9b4ea3', name: "Teoria do Direito"},
            {id: 'fc40c88d-65ae-41ca-bd19-89075f9b4ea3', name: "Direito Civil"},
        ],
    };

    const onFileSelect = (e) => {
            setAttachment(e.files); 
    };
    const onFileRemove = (e) => {
        attachment.splice(e.index, 1); 
    };
    const handleFileUploadCancel = () => {
           setAttachment([]);
       };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        setDisciplineId(""); // Reseta a disciplina ao mudar o curso
        setDisciplines(disciplinesData[courseId] || []); // Atualiza as disciplinas com base no curso
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crie um objeto FormData para enviar arquivos e outros dados
        const formData = new FormData();
        formData.append("discipline", disciplineId);
        formData.append("notice", "1f7755ade0b341299ee00c46a12dc467"); // TODO BUSCAR ID DO EDITAL ATUAL
        formData.append("course_workload", courseWorkload);
        formData.append("course_studied_workload", courseStudiedWorkload);
        formData.append("status", status);
        formData.append("student_id", user.id);

        console.log("Status sendo enviado:", status);

        if (requestType === "certificacao") {
            formData.append("requestType", "certificacao");
            formData.append("previous_knowledge", previousKnowledge);
        } else if (requestType === "aproveitamento") {
            formData.append("requestType", "aproveitamento");
        } else {
            console.error("Tipo de requisição inválido.");
            return; // Para o envio se o tipo de requisição não for válido
        }
        if (attachment && attachment.length > 0) {
            attachment.forEach((file) => {
                formData.append('attachment', file);
            });
        }

        const response = requestType === "certificacao"
        ? await RequestService.CreateKnowledgeCertification(formData)
        : await RequestService.CreateRecognitionForm(formData)

        if (response.status === 200) {
            console.log("Formulário enviado com sucesso!");
        } else {
            console.error("Erro ao enviar o formulário:", response);
        }
};

    const handleCancel = () => {
        console.log("teste cancelar");
        console.log(attachment);
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.typeContainer}>
                <label className={styles.textForm}>Tipo:</label>
                <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className={styles.selectForm}
                >
                    <option value="">Selecione</option>
                    <option value="certificacao">Certificação de Conhecimento</option>
                    <option value="aproveitamento">Aproveitamento de Estudos</option>
                </select>
            </div>
            <div className={styles.typeContainer}>
                <label className={styles.textForm}>Curso:</label>
                <select
                    value={selectedCourse}
                    onChange={handleCourseChange}
                    className={styles.selectForm}
                    required
                >
                    <option value="">Selecione um curso</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.typeContainer}>
                <label className={styles.textForm}>Disciplina:</label>
                <select
                    value={disciplineId}
                    onChange={(e) => setDisciplineId(e.target.value)}
                    className={styles.selectForm}
                    disabled={!selectedCourse}
                    required
                >
                    <option value="">Selecione uma disciplina</option>
                    {disciplines.map((discipline) => (
                        <option key={discipline.id} value={discipline.id}>
                            {discipline.name}
                        </option>
                    ))}
                </select>
            </div>
            {requestType === "certificacao" && (
                <div className={styles.typeContainer}>
                    <label className={styles.textForm}>Conhecimento Anterior:</label>
                    <textarea
                        value={previousKnowledge}
                        onChange={(e) => setPreviousKnowledge(e.target.value)}
                        placeholder="Descreva seu conhecimento anterior..."
                        className={styles.selectForm}
                        required
                    />
                </div>
            )}
            {requestType === "aproveitamento" && (
                <div className={styles.typeContainer}>
                    <label className={styles.textForm}>Carga Horária:</label>
                    <input
                        type="number"
                        value={courseWorkload}
                        onChange={(e) => setCourseWorkload(e.target.value)}
                        placeholder="Carga horária em horas"
                        className={styles.selectForm}
                        required
                    />
                    <label className={styles.textForm}>Carga Horária Estudada:</label>
                    <input
                        type="number"
                        value={courseStudiedWorkload}
                        onChange={(e) => setCourseStudiedWorkload(e.target.value)}
                        placeholder="Carga horária estudada em horas"
                        className={styles.selectForm}
                        required
                    />
                </div>
            )}
            <div className={styles.typeContainer}>
                <label htmlFor="anexos" className={styles.textForm}>Anexar arquivos:</label>
                <FileUpload
                    name="attachment"
                    multiple
                    customUpload={true}
                    accept="application/pdf,image/png,image/jpeg"
                    maxFileSize={5000000}
                    chooseLabel="Selecionar anexos"
                    cancelLabel="Cancelar" 
                    uploadHandler={() => {}} // Função vazia
                    onSelect={(e) => onFileSelect(e)}
                    onClear={handleFileUploadCancel}
                    onRemove={(e) => onFileRemove (e)}
                    className={styles.selectForm}
                />
            </div>
            <div className={styles.formBtnContainer}>
                <Button type={"button"} color={"#af0a0a"} onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button type={"submit"} style={{marginLeft: 'auto'}}>Enviar</Button>
            </div>
        </form>
    );
};

export default CertificationRequestForm;
