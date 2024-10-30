import { useState } from "react";
import { TextField } from "@mui/material";
import styles from "./modalNotice.module.css";
import { Button } from "../../Button/button";
import { noticeCreate, noticeEdit } from "@/services/NoticeService";

const ModalNotice = ({ onClose, editData = null }) => {
  const [formData, setFormData] = useState({
    publicationDateFrom: editData?.publicationDateFrom || "",
    publicationDateTo: editData?.publicationDateTo || "",
    documentationDeadlineFrom: editData?.documentationDeadlineFrom || "",
    documentationDeadlineTo: editData?.documentationDeadlineTo || "",
    proposalAnalysisFrom: editData?.proposalAnalysisFrom || "",
    proposalAnalysisTo: editData?.proposalAnalysisTo || "",
    resultPublicationFrom: editData?.resultPublicationFrom || "",
    resultPublicationTo: editData?.resultPublicationTo || "",
    resultApprovalFrom: editData?.resultApprovalFrom || "",
    resultApprovalTo: editData?.resultApprovalTo || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      number: "003-2023", // ajuste o número conforme necessário
      publication_date: new Date(
        `${formData.publicationDateFrom}T09:00:00Z`
      ).toISOString(),
      documentation_submission_start: new Date(
        `${formData.documentationDeadlineFrom}T09:00:00Z`
      ).toISOString(),
      documentation_submission_end: new Date(
        `${formData.documentationDeadlineTo}T17:00:00Z`
      ).toISOString(),
      proposal_analysis_start: new Date(
        `${formData.proposalAnalysisFrom}T09:00:00Z`
      ).toISOString(),
      proposal_analysis_end: new Date(
        `${formData.proposalAnalysisTo}T17:00:00Z`
      ).toISOString(),
      result_publication_start: new Date(
        `${formData.resultPublicationFrom}T09:00:00Z`
      ).toISOString(),
      result_publication_end: new Date(
        `${formData.resultPublicationTo}T17:00:00Z`
      ).toISOString(),
      result_homologation_start: new Date(
        `${formData.resultApprovalFrom}T09:00:00Z`
      ).toISOString(),
      result_homologation_end: new Date(
        `${formData.resultApprovalTo}T17:00:00Z`
      ).toISOString(),
    };

    try {
      if (editData) {
        await noticeEdit(editData.id, payload);
      } else {
        await noticeCreate(payload);
      }
      onClose();
    } catch (error) {
      console.log("Erro ao enviar os dados:", error);
    }
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
