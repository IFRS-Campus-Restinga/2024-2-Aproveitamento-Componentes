import { useState } from "react";
import { TextField } from "@mui/material";
import styles from "./modalNotice.module.css";
import { Button } from "../../Button/button";

const ModalNotice = ({ onClose }) => {
  const [formData, setFormData] = useState({
    publicationDateFrom: "",
    publicationDateTo: "",
    documentationDeadlineFrom: "",
    documentationDeadlineTo: "",
    proposalAnalysisFrom: "",
    proposalAnalysisTo: "",
    resultPublicationFrom: "",
    resultPublicationTo: "",
    resultApprovalFrom: "",
    resultApprovalTo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica para enviar os dados do formData
    console.log("Form Data:", formData);
  };

  return (
    <div className={styles.modalBackground}>
      <form onSubmit={handleSubmit} className={styles.modalContainer}>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Data de Publicação do Edital
        </label>
        <div className={styles.dateRange}>
          <label>De</label>
          <TextField
            type="date"
            name="publicationDateFrom"
            value={formData.publicationDateFrom}
            onChange={handleChange}
            className={styles.dateInput}
            fullWidth
          />
          <label>Até</label>
          <TextField
            type="date"
            name="publicationDateTo"
            value={formData.publicationDateTo}
            onChange={handleChange}
            className={styles.dateInput}
            fullWidth
          />
        </div>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Prazo para Entrega da Documentação
        </label>
        <div className={styles.dateRange}>
          <label>De</label>
          <TextField
            type="date"
            name="documentationDeadlineFrom"
            value={formData.documentationDeadlineFrom}
            onChange={handleChange}
            className={styles.dateInput}
            fullWidth
          />
          <label>Até</label>
          <TextField
            type="date"
            name="documentationDeadlineTo"
            value={formData.documentationDeadlineTo}
            onChange={handleChange}
            className={styles.dateInput}
            fullWidth
          />
        </div>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Prazo para Análise das Propostas
        </label>
        <div className={styles.dateRange}>
          <label>De</label>
          <TextField
            type="date"
            name="proposalAnalysisFrom"
            value={formData.proposalAnalysisFrom}
            onChange={handleChange}
            className={styles.dateInput}
            fullWidth
          />
          <label>Até</label>
          <TextField
            type="date"
            name="proposalAnalysisTo"
            value={formData.proposalAnalysisTo}
            onChange={handleChange}
            className={styles.dateInput}
            fullWidth
          />
        </div>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Publicação do Resultado
        </label>
        <div className={styles.dateRange}>
          <label>De</label>
          <TextField
            type="date"
            name="resultPublicationFrom"
            value={formData.resultPublicationFrom}
            onChange={handleChange}
            className={styles.dateInput}
            fullWidth
          />
          <label>Até</label>
          <TextField
            type="date"
            name="resultPublicationTo"
            value={formData.resultPublicationTo}
            onChange={handleChange}
            className={styles.dateInput}
            fullWidth
          />
        </div>
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Homologação do Resultado
        </label>
        <div className={styles.dateRange}>
          <label>De</label>
          <TextField
            type="date"
            name="resultApprovalFrom"
            value={formData.resultApprovalFrom}
            onChange={handleChange}
            className={styles.dateInput}
            fullWidth
          />
          <label>Até</label>
          <TextField
            type="date"
            name="resultApprovalTo"
            value={formData.resultApprovalTo}
            onChange={handleChange}
            className={styles.dateInput}
            fullWidth
          />
        </div>
        <div style={{ display: "flex", gap: "50px" }}>
          <Button type="submit">Cadastrar</Button>
          <Button type="button" color="#af0a0a" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModalNotice;
