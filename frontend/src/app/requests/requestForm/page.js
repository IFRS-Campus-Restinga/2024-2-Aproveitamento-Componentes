"use client";

import { useEffect, useState } from "react";
import {useAuth} from "@/context/AuthContext";
import styles from "./requestForm.module.css";
import { Button } from "@/components/Button/button";
import { baseURL } from "@/libs/api";
import { noticeList } from "@/services/NoticeService";

const CertificationRequestForm = () => {
  const [requestType, setRequestType] = useState("");
  const [previousKnowledge, setPreviousKnowledge] = useState("");
  const [courseWorkload, setCourseWorkload] = useState("");
  const [courseStudiedWorkload, setCourseStudiedWorkload] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [status] = useState("CR");
  const {user} = useAuth();
  console.log("###" + JSON.stringify(user));
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState("");

  const courses = [
    { id: 1, name: "Curso de Engenharia" },
    { id: 2, name: "Curso de Medicina" },
    { id: 3, name: "Curso de Direito" },
  ];

  const disciplinesData = {
    // TODO REMOVER
    1: [
      { id: "fc40c88d-65ae-41ca-bd19-89075f9b4ea3", name: "Matemática" },
      { id: "fc40c88d-65ae-41ca-bd19-89075f9b4ea3", name: "Física" },
    ],
    2: [
      { id: "fc40c88d-65ae-41ca-bd19-89075f9b4ea3", name: "Anatomia" },
      { id: "fc40c88d-65ae-41ca-bd19-89075f9b4ea3", name: "Fisiologia" },
    ],
    3: [
      { id: "fc40c88d-65ae-41ca-bd19-89075f9b4ea3", name: "Teoria do Direito" },
      { id: "fc40c88d-65ae-41ca-bd19-89075f9b4ea3", name: "Direito Civil" },
    ],
  };

  const [disciplines, setDisciplines] = useState([]);

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
    formData.append("notice", selectedNotice);
    formData.append("course_workload", courseWorkload);
    formData.append("course_studied_workload", courseStudiedWorkload);
    formData.append("status", status);
    formData.append("student_id", user.id);

    console.log("Status sendo enviado:", status); // Adicione esta linha

    if (requestType === "certificacao") {
      formData.append("requestType", "certificacao");
      formData.append("previous_knowledge", previousKnowledge);
    } else if (requestType === "aproveitamento") {
      formData.append("requestType", "aproveitamento");
    } else {
      console.error("Tipo de requisição inválido.");
      return; // Para o envio se o tipo de requisição não for válido
    }

    const endpoint =
      requestType === "certificacao"
        ? baseURL + "/forms/knowledge-certifications/"
        : baseURL + "/forms/recognition-forms/";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Formulário enviado com sucesso!");
      } else {
        const errorData = await response.json();
        console.error("Erro ao enviar o formulário:", errorData);
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  };

  const handleCancel = () => {
    console.log("teste cancelar");
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.typeContainer}>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>Tipo</label>
        <select
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
          className={styles.typeSelect}
        >
          <option value="">Selecione</option>
          <option value="certificacao">Certificação de Conhecimento</option>
          <option value="aproveitamento">Aproveitamento de Estudos</option>
        </select>
      </div>
      <div className={styles.typeContainer}>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>Edital</label>
        <select
          value={selectedNotice}
          onChange={(e) => setSelectedNotice(e.target.value)}
          className={styles.typeSelect}
          required
        >
          <option value="">Selecione um edital</option>
          {notices
            .sort(
              (a, b) =>
                new Date(b.publication_date) - new Date(a.publication_date)
            )
            .slice(0, 1)
            .map((notice) => (
              <option key={notice.id} value={notice.id}>
                {notice.number} -{" "}
                {new Date(notice.publication_date).toLocaleDateString()}
              </option>
            ))}
        </select>
      </div>
      <div className={styles.typeContainer}>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>Curso</label>
        <select
          value={selectedCourse}
          onChange={handleCourseChange}
          className={styles.typeSelect}
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
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Disciplina
        </label>
        <select
          value={disciplineId}
          onChange={(e) => setDisciplineId(e.target.value)}
          className={styles.typeSelect}
          disabled={!selectedCourse} // Desabilita se nenhum curso estiver selecionado
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
          <label style={{ fontWeight: "700", fontSize: "20px" }}>
            Conhecimento Anterior
          </label>
          <textarea
            value={previousKnowledge}
            onChange={(e) => setPreviousKnowledge(e.target.value)}
            placeholder="Descreva seu conhecimento anterior..."
            className={styles.typeSelect}
            required
          />
        </div>
      )}
      {requestType === "aproveitamento" && (
        <div className={styles.typeContainer}>
          <label style={{ fontWeight: "700", fontSize: "20px" }}>
            Carga Horária
          </label>
          <input
            type="number"
            value={courseWorkload}
            onChange={(e) => setCourseWorkload(e.target.value)}
            placeholder="Carga horária em horas"
            className={styles.typeSelect}
            required
          />
          <label style={{ fontWeight: "700", fontSize: "20px" }}>
            Carga Horária Estudada
          </label>
          <input
            type="number"
            value={courseStudiedWorkload}
            onChange={(e) => setCourseStudiedWorkload(e.target.value)}
            placeholder="Carga horária estudada em horas"
            className={styles.typeSelect}
            required
          />
        </div>
      )}
      <div className={styles.formBtnContainer}>
        <Button type={"button"} color={"#af0a0a"} onClick={handleCancel}>
          Cancelar
        </Button>
        <Button type={"submit"} style={{ marginLeft: "auto" }}>
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default CertificationRequestForm;
