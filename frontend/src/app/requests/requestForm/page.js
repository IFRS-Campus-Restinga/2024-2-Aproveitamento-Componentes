"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./requestForm.module.css";
import { Button } from "@/components/Button/button";
import { baseURL } from "@/libs/api";
import { noticeList } from "@/services/NoticeService";
import { FileUpload } from "primereact/fileupload";
import RequestService from "@/services/RequestService";
import { courseList } from "@/services/CourseService";
import { GetDiscipline } from "@/services/DisciplineService";

const CertificationRequestForm = () => {
  const [requestType, setRequestType] = useState("");
  const [previousKnowledge, setPreviousKnowledge] = useState("");
  const [courseWorkload, setCourseWorkload] = useState("");
  const [courseStudiedWorkload, setCourseStudiedWorkload] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [disciplines, setDisciplines] = useState([]);
  const [attachment, setAttachment] = useState([]);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState("");
  const [status] = useState("CR");
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  console.log("###" + JSON.stringify(user));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseList();
        setCourses(data.courses);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCourses();
  }, []);

  const onFileSelect = (e) => {
    setAttachment(e.files);
  };
  const onFileRemove = (e) => {
    attachment.splice(e.index, 1);
  };
  const handleFileUploadCancel = () => {
    setAttachment([]);
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticeData = await noticeList();
        setNotices(noticeData);
      } catch (error) {
        console.error("Erro ao buscar notices:", error);
      }
    };

    fetchNotices();
  }, []);

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setDisciplineId(""); // Reseta a disciplina ao mudar o curso

    if (courseId) {
      try {
        const course = courses.find((course) => course.id === courseId);
        const disciplinePromises = course.disciplines.map((id) =>
          GetDiscipline(id)
        );

        const disciplineResults = await Promise.all(disciplinePromises);
        setDisciplines(disciplineResults);
      } catch (error) {
        console.error("Erro ao carregar as disciplinas:", error);
        setDisciplines([]);
      }
    } else {
      setDisciplines([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crie um objeto FormData para enviar arquivos e outros dados
    const formData = new FormData();
    formData.append("discipline", disciplineId);
    formData.append("notice", selectedNotice);
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
      return;
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
        <label className={styles.textForm}>Edital</label>
        <div>
          {notices
            .filter(
              (notice) =>
                new Date(notice.documentation_submission_start) <= new Date() && new Date(notice.documentation_submission_end) >= new Date()
            )
            .sort(
              (a, b) =>
                new Date(b.documentation_submission_start) - new Date(a.documentation_submission_start) // Ordenação com base na data de início
            )
            .slice(0, 1) // Pega o edital vigente
            .map((notice) => (
              <span key={notice.id}>
                {notice.number} - {new Date(notice.documentation_submission_start).toLocaleDateString()} a {new Date(notice.documentation_submission_end).toLocaleDateString()}
              </span>
            ))}
          
          {/* Mensagem quando não há edital vigente */}
          {notices.filter(
              (notice) =>
                new Date(notice.documentation_submission_start) <= new Date() && new Date(notice.documentation_submission_end) >= new Date()
            ).length === 0 && (
              <span>Não há editais abertos</span>
            )}
        </div>
      </div>
      <div className={styles.typeContainer}>
        <label className={styles.textForm}>Curso</label>
        <select
          value={selectedCourse}
          onChange={handleCourseChange}
          className={styles.selectForm}
          required
        >
          <option value="">Selecione um curso</option>
          {courses
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.typeContainer}>
        <label className={styles.textForm}>Disciplina</label>
        <select
          value={disciplineId}
          onChange={(e) => setDisciplineId(e.target.value)}
          className={styles.selectForm}
          disabled={!selectedCourse} // Desabilita se nenhum curso estiver selecionado
          required
        >
          <option value="">Selecione uma disciplina</option>
          {disciplines
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.name}
            </option>
          ))}
        </select>
      </div>
      {requestType === "certificacao" && (
        <div className={styles.typeContainer}>
          <label className={styles.textForm}>Conhecimento Anterior</label>
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
          <label className={styles.textForm}>Carga Horária</label>
          <input
            type="number"
            value={courseWorkload}
            onChange={(e) => setCourseWorkload(e.target.value)}
            placeholder="Carga horária em horas"
            className={styles.selectForm}
            required
          />
          <label className={styles.textForm}>Carga Horária Estudada</label>
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
          uploadHandler={() => { }} // Função vazia
          onSelect={(e) => onFileSelect(e)}
          onClear={handleFileUploadCancel}
          onRemove={(e) => onFileRemove(e)}
          className={styles.selectForm}
        />
      </div>
      <div className={styles.formBtnContainer}>
        <Button type={"button"} color={"#af0a0a"} onClick={handleCancel}>
          Cancelar
        </Button>
        <Button type={"submit"} style={{ marginLeft: 'auto' }}>Enviar</Button>
      </div>
    </form>
  );
};

export default CertificationRequestForm;
