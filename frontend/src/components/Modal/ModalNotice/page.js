import { useState } from "react";
import { TextField } from "@mui/material";
import styles from "./modalNotice.module.css";
import { Button } from "../../Button/button";
import { noticeCreate, noticeEdit } from "@/services/NoticeService";

const ModalNotice = ({ onClose, editData = null }) => {
  const [formData, setFormData] = useState({
    number: editData?.number || "",
    publicationDate: editData?.publicationDate || "",
    publicationDateTo: editData?.publicationDateTo || "",
    documentationDeadlineFrom: editData?.documentationDeadlineFrom || "",
    documentationDeadlineTo: editData?.documentationDeadlineTo || "",
    proposalAnalysisFrom: editData?.proposalAnalysisFrom || "",
    proposalAnalysisTo: editData?.proposalAnalysisTo || "",
    resultPublicationFrom: editData?.resultPublicationFrom || "",
    resultPublicationTo: editData?.resultPublicationTo || "",
    resultApprovalFrom: editData?.resultApprovalFrom || "",
    resultApprovalTo: editData?.resultApprovalTo || "",
    link: editData?.link || "",
    rectifications: editData?.rectifications || [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRectificationChange = (index, value) => {
    setFormData((prev) => {
      const updatedRectifications = [...prev.rectifications];
      updatedRectifications[index] = value;
      return { ...prev, rectifications: updatedRectifications };
    });
  };

  const addRectification = () => {
    setFormData((prev) => ({
      ...prev,
      rectifications: [...prev.rectifications, ""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      number: formData.number,
      publication_date: new Date(
        `${formData.publicationDate}T09:00:00Z`
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
      link: formData.link,
      rectifications: formData.rectifications.filter((link) => link !== ""),
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
          Número do Edital
        </label>
        <TextField
          type="text"
          name="number"
          value={formData.number}
          onChange={handleChange}
          placeholder="Ex: 002-2024"
          className={styles.textInput}
          fullWidth
        />
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Data de Publicação do Edital
        </label>
        <div className={styles.dateRange}>
          <TextField
            type="date"
            name="publicationDate"
            value={formData.publicationDate}
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
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Link do Edital
        </label>
        <TextField
          type="text"
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="Insira o link do edital"
          className={styles.textInput}
          fullWidth
        />
        <label style={{ fontWeight: "700", fontSize: "20px" }}>
          Retificações
        </label>
        {formData.rectifications.map((rectification, index) => (
          <TextField
            key={index}
            type="text"
            value={rectification}
            onChange={(e) => handleRectificationChange(index, e.target.value)}
            placeholder="Insira o link da retificação"
            className={styles.textInput}
            fullWidth
          />
        ))}
        <Button type="button" onClick={addRectification}>
          Adicionar Retificação
        </Button>
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
