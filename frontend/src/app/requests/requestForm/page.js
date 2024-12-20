"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./requestForm.module.css";
import { Button } from "primereact/button";
import { noticeListAll } from "@/services/NoticeService";
import { FileUpload } from "primereact/fileupload";
import RequestService from "@/services/RequestService";
import { courseList } from "@/services/CourseService";
import { DisciplineList, GetDiscipline } from "@/services/DisciplineService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const CertificationRequestForm = () => {
  const [requestType, setRequestType] = useState("");
  const [previousKnowledge, setPreviousKnowledge] = useState("");
  const [courseWorkload, setCourseWorkload] = useState("");
  const [courseStudiedWorkload, setCourseStudiedWorkload] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [disciplines, setDisciplines] = useState([]);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState("");
  const [status] = useState("CR");
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [temDisciplines, setTempDisciplines] = useState([]);

  // Usaremos um contador para gerar IDs incrementais.
  const idCounterRef = useRef(1);

  // Estado para gerenciar as linhas de upload (cada linha com um FileUpload básico)
  const [uploadLines, setUploadLines] = useState([
    { id: idCounterRef.current, file: null },
  ]);

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

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticeData = await noticeListAll();
        console.log(noticeData);
        setNotices(noticeData.results);
        const currentNotice = noticeData.results
          .filter(
            (notice) =>
              new Date(notice.documentation_submission_start) <= new Date() &&
              new Date(notice.documentation_submission_end) >= new Date()
          )
          .sort(
            (a, b) =>
              new Date(b.documentation_submission_start) -
              new Date(a.documentation_submission_start)
          )
          .slice(0, 1)[0];
        setSelectedNotice(currentNotice || null);
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
        console.log(disciplineResults);
        setDisciplines(disciplineResults);
      } catch (error) {
        console.error("Erro ao carregar as disciplinas:", error);
        setDisciplines([]);
      }
    } else {
      setDisciplines([]);
    }
  };

  // Função para atualizar o arquivo escolhido em uma linha específica
  const handleFileSelect = (lineId, event) => {
    const file = event.files && event.files.length > 0 ? event.files[0] : null;
    setUploadLines((prevLines) =>
      prevLines.map((line) =>
        line.id === lineId ? { ...line, file: file } : line
      )
    );
    console.log("Linhas de upload após seleção de arquivo:", uploadLines);
  };

  // Função para adicionar uma nova linha de upload
  const addUploadLine = () => {
    idCounterRef.current += 1;
    setUploadLines((prevLines) => [
      ...prevLines,
      { id: idCounterRef.current, file: null },
    ]);
    console.log("Linhas de upload após adição:", uploadLines);
  };

  // Função para remover uma linha de upload
  const removeUploadLine = (lineId) => {
    setUploadLines((prevLines) => prevLines.filter((line) => line.id !== lineId));
    console.log("Linhas de upload após remoção:", uploadLines);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crie um objeto FormData para enviar arquivos e outros dados
    const formData = new FormData();
    formData.append("discipline", disciplineId);
    formData.append("notice", selectedNotice.id);
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

    // Anexar os arquivos de cada linha ao formData
    uploadLines.forEach((line) => {
      if (line.file) {
        formData.append("attachment", line.file);
      }
    });

    const response =
      requestType === "certificacao"
        ? await RequestService.CreateKnowledgeCertification(formData)
        : await RequestService.CreateRecognitionForm(formData);

    if (response.status === 201) {
      console.log("Formulário enviado com sucesso!");
      window.location.href = "/requests";
    } else {
      console.error("Erro ao enviar o formulário:", response);
    }
  };

  const handleCancel = () => {
    console.log("Ação de cancelar.");
    console.log("Linhas atuais de upload:", uploadLines);
  };

  const fetchDsiciplines = async () => {
    const data = await DisciplineList();
    console.log(data);
    setTempDisciplines(data)
  }

  useEffect(() => {
    fetchDsiciplines();
  }, [])

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.typeContainer}>
        <label className={styles.textForm}>Edital</label>
        <div>
          {selectedNotice ? (
            <span key={selectedNotice.id}>
              {" "}
              {selectedNotice.number} -{" "}
              {new Date(
                selectedNotice.documentation_submission_start
              ).toLocaleDateString()}{" "}
              a{" "}
              {new Date(
                selectedNotice.documentation_submission_end
              ).toLocaleDateString()}{" "}
            </span>
          ) : (
            <span>Nenhum edital vigente no momento.</span>
          )}
        </div>
      </div>
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
          disabled={!selectedCourse}
          required
        >
          <option value="">Selecione uma disciplina</option>
          {temDisciplines
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

      {/* Linhas de upload */}
      <div className={styles.typeContainer}>
        <label htmlFor="anexos" className={styles.textForm}>
          Anexar arquivos:
        </label>
        {uploadLines.map((line) => (
          <div
            key={line.id}
            style={{ display: "flex", alignItems: "center" }}
          >
            <FileUpload
              name="singleAttachment"
              mode="basic"
              accept="application/pdf,image/png,image/jpeg"
              maxFileSize={5000000}
              chooseLabel="Selecionar arquivo"
              className={styles.selectForm}
              onSelect={(e) => handleFileSelect(line.id, e)}
              auto={false}
              customUpload={true}
            />
            <Button
              type="button"
              className={styles.cancelButton}
              style={{ marginLeft: "0.5rem" }}
              onClick={() => removeUploadLine(line.id)}
            >
              X
            </Button>
          </div>
        ))}
        <div className={styles.addButtonContainer}>
          <button type="button" onClick={addUploadLine} className={styles.addButton}>

            <i className="pi pi-plus" style={{ fontSize: '1.5rem', color: '#ffff' }}></i>
          </button>
        </div>
      </div>

      <div className={styles.formBtnContainer}>
        <Button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          disabled={!selectedNotice}
          className={
            !selectedNotice ? styles.btnDisabled : styles.confirmButton
          }
          onClick={handleSubmit}
        >
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default CertificationRequestForm;
