"use client";
import { useState } from "react";
import styles from "./requestForm.module.css";
import { Button } from "@/components/Button/button";
const CertificationRequestForm = () => {
  const [requestType, setRequestType] = useState("");
  const [curricularComponent, setCurricularComponent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [experience, setExperience] = useState("");
  const [previousComponent, setPreviousComponent] = useState("");
  const [grade, setGrade] = useState("");
  const [hours, setHours] = useState("");
  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };
  const handleSubmit = (e) => {
    console.log("teste enviar");
    e.preventDefault();
    // Lógica para envio do formulário
  };
  const handleCancel = () => {
    console.log("teste cancelar");
    // Lógica para cancelamento, como resetar o formulário ou redirecionar
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
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Componente Curricular
        </label>
        <select
          value={curricularComponent}
          onChange={(e) => setCurricularComponent(e.target.value)}
          className={styles.typeSelect}
        >
          <option value="">Selecione</option>
          <option value="curso1">Curso 1</option>
          <option value="curso2">Curso 2</option>
        </select>
      </div>
      {requestType === "certificacao" && (
        <div className={styles.typeContainer}>
          <label style={{ fontWeight: "700", fontSize: "20px" }}>
            Experiência Anterior
          </label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Descreva sua experiência anterior..."
            className={styles.typeSelect}
          />
        </div>
      )}
      {requestType === "aproveitamento" && (
        <>
          <div className={styles.typeContainer}>
            <label style={{ fontWeight: "700", fontSize: "20px" }}>
              Componente Cursado Anteriormente
            </label>
            <input
              type="text"
              value={previousComponent}
              onChange={(e) => setPreviousComponent(e.target.value)}
              placeholder="Componente cursado anteriormente"
              className={styles.typeSelect}
            />
          </div>
          <div className={styles.classInfo}>
            <div className={styles.typeContainer}>
              <label style={{ fontWeight: "700", fontSize: "20px" }}>
                Nota Obtida
              </label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Nota obtida"
                className={styles.typeSelect}
              />
            </div>
            <div className={styles.typeContainer}>
              <label style={{ fontWeight: "700", fontSize: "20px" }}>
                Carga Horária
              </label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Carga horária em horas"
                className={styles.typeSelect}
              />
            </div>
          </div>
        </>
      )}
      <div className={styles.typeContainer}>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>Anexos</label>
        <input
          className={styles.attachmentsContainer}
          type="file"
          multiple
          onChange={handleFileChange}
        />
      </div>
      <div className={styles.formBtnContainer}>
        <Button type={"submit"}>Enviar</Button>
        <Button type={"button"} color={"#af0a0a"} onClick={handleCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
export default CertificationRequestForm;