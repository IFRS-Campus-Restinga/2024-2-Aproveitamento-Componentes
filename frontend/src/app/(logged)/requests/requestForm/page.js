"use client";

import { useEffect, useState } from "react";
import styles from "./requestForm.module.css";
import { Button } from "@/components/Button/button";
import { baseURL } from "@/libs/api";

const CertificationRequestForm = () => {
  const [requestType, setRequestType] = useState("");
  // const [attachments, setAttachments] = useState([]); // Removido
  const [previousKnowledge, setPreviousKnowledge] = useState("");
  const [courseWorkload, setCourseWorkload] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(""); // Curso selecionado
  const [disciplineId, setDisciplineId] = useState(""); // ID da disciplina que será enviado

  // Dados mockados de cursos e disciplinas
  const courses = [
    { id: 1, name: "Curso de Engenharia" },
    { id: 2, name: "Curso de Medicina" },
    { id: 3, name: "Curso de Direito" },
  ];

  const disciplinesData = {
    1: [
      { id: 101, name: "Matemática" },
      { id: 102, name: "Física" },
    ],
    2: [
      { id: 201, name: "Anatomia" },
      { id: 202, name: "Fisiologia" },
    ],
    3: [
      { id: 301, name: "Teoria do Direito" },
      { id: 302, name: "Direito Civil" },
    ],
  };

  // Estado para armazenar as disciplinas com base no curso selecionado
  const [disciplines, setDisciplines] = useState([]);

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setDisciplineId(""); // Reseta a disciplina ao mudar o curso
    setDisciplines(disciplinesData[courseId] || []); // Atualiza as disciplinas com base no curso
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Crie um objeto FormData para enviar arquivos e outros dados
    const formData = new FormData();
    formData.append("discipline", disciplineId);

    // Removido: Anexos não serão enviados

    if (requestType === "certificacao") {
      formData.append("requestType", "certificacao");
      formData.append("previous_knowledge", previousKnowledge);
      formData.append("course_workload", courseWorkload);
    } else if (requestType === "aproveitamento") {
      formData.append("requestType", "aproveitamento");
      formData.append("course_workload", courseWorkload);
      // Para 'aproveitamento', você deve adicionar o que for relevante.
    } else {
      console.error("Tipo de requisição inválido.");
      return; // Para o envio se o tipo de requisição não for válido
    }

    const endpoint = requestType === "certificacao"
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
        <label style={{ fontWeight: "700", fontSize: "20px" }}>Disciplina</label>
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
          <label style={{ fontWeight: "700", fontSize: "20px" }}>Conhecimento Anterior</label>
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
          <label style={{ fontWeight: "700", fontSize: "20px" }}>Carga Horária</label>
          <input
            type="number"
            value={courseWorkload}
            onChange={(e) => setCourseWorkload(e.target.value)}
            placeholder="Carga horária em horas"
            className={styles.typeSelect}
            required
          />
        </div>
      )}
      {/* Anexos removidos */}
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
