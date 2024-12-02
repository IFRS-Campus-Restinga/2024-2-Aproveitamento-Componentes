import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import styles from "./modalNotice.module.css";
import { Button } from "../../Button/button";
import { noticeCreate, noticeEdit } from "@/services/NoticeService";
import Toast from "../../../utils/toast";

const ModalNotice = ({ onClose, editData = null, response }) => {
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [isFormValid, setIsFormValid] = useState();
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    number: editData?.number || "",
    publicationDate: formatDate(editData?.publication_date),
    documentationDeadlineFrom: formatDate(
      editData?.documentation_submission_start
    ),
    documentationDeadlineTo: formatDate(editData?.documentation_submission_end),
    proposalAnalysisFrom: formatDate(editData?.proposal_analysis_start),
    proposalAnalysisTo: formatDate(editData?.proposal_analysis_end),
    resultPublication: formatDate(editData?.result_publication), // Único campo agora
    resultApproval: formatDate(editData?.result_homologation), // Único campo agora
    link: editData?.link || "",
    rectifications: editData?.rectifications || [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      const dateFields = [
        ["documentationDeadlineFrom", "documentationDeadlineTo"],
        ["proposalAnalysisFrom", "proposalAnalysisTo"],
      ];

      dateFields.forEach(([startField, endField]) => {
        if (name === startField && updatedData[endField]) {
          const fromDate = new Date(value);
          const toDate = new Date(updatedData[endField]);
          if (toDate < fromDate) {
            updatedData[endField] = value;
          }
        }
        if (name === endField && updatedData[startField]) {
          const fromDate = new Date(updatedData[startField]);
          const toDate = new Date(value);
          if (toDate < fromDate) {
            updatedData[startField] = value;
          }
        }
      });

      if (name === "documentationDeadlineTo") {
        const analysisTo = new Date(updatedData.proposalAnalysisTo);
        const docTo = new Date(value);

        if (analysisTo && docTo > analysisTo) {
          updatedData.documentationDeadlineTo = updatedData.proposalAnalysisTo;
        }
      }

      if (name === "proposalAnalysisTo") {
        const docTo = new Date(updatedData.documentationDeadlineTo);
        const analysisTo = new Date(value);

        if (docTo && docTo > analysisTo) {
          updatedData.documentationDeadlineTo = value;
        }
      }

      if (name === "proposalAnalysisFrom") {
        const docFrom = new Date(updatedData.documentationDeadlineFrom);
        const docTo = new Date(updatedData.documentationDeadlineTo);
        const analysisFrom = new Date(value);

        if (docFrom && analysisFrom < docFrom) {
          updatedData.proposalAnalysisFrom =
            updatedData.documentationDeadlineFrom;
        }

        if (docTo && analysisFrom > docTo) {
          updatedData.proposalAnalysisFrom =
            updatedData.documentationDeadlineTo;
        }
      }

      if (name === "documentationDeadlineFrom") {
        const analysisFrom = new Date(updatedData.proposalAnalysisFrom);
        const docFrom = new Date(value);

        if (analysisFrom && docFrom > analysisFrom) {
          updatedData.proposalAnalysisFrom = value;
        }
      }

      return updatedData;
    });
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
      result_publication: new Date(
        `${formData.resultPublication}T09:00:00Z`
      ).toISOString(),
      result_homologation: new Date(
        `${formData.resultApproval}T09:00:00Z`
      ).toISOString(),
      link: formData.link,
      rectifications: formData.rectifications.filter((link) => link !== ""),
    };

    try {
      if (editData) {
        await noticeEdit(editData.id, payload);
        response("edit");
      } else {
        await noticeCreate(payload);
        response("create");
      }
      onClose();
    } catch (error) {
      response("error");
    }
  };

  useEffect(() => {
    const requiredFields = [
      "number",
      "publicationDate",
      "documentationDeadlineFrom",
      "documentationDeadlineTo",
      "proposalAnalysisFrom",
      "proposalAnalysisTo",
      "resultPublication",
      "resultApproval",
      "link",
    ];
    const isValid = requiredFields.every(
      (field) => formData[field].trim() !== ""
    );
    const isLinkValid = isValidURL(formData.link);
    const areRectificationsValid = formData.rectifications.every(
      (rect) => rect === "" || isValidURL(rect)
    );
    setIsFormValid(isValid && isLinkValid && areRectificationsValid);
  }, [formData]);

  useEffect(() => {
    const validateFields = () => {
      const errors = {};

      const requiredFields = [
        "number",
        "publicationDate",
        "documentationDeadlineFrom",
        "documentationDeadlineTo",
        "proposalAnalysisFrom",
        "proposalAnalysisTo",
        "resultPublication",
        "resultApproval",
        "link",
      ];

      requiredFields.forEach((field) => {
        if (!formData[field]?.trim()) {
          errors[field] = "Campo obrigatório";
        }
      });

      if (formData.number && !isValidNumber(formData.number)) {
        errors.number = "Formato inválido (exemplo: 002-2024)";
      }

      if (formData.link && !isValidURL(formData.link)) {
        errors.link = "URL inválida";
      }

      formData.rectifications.forEach((rect, index) => {
        if (rect && !isValidURL(rect)) {
          errors[`rectifications-${index}`] = "URL inválida";
        }
      });

      setFieldErrors(errors);
      setIsFormValid(Object.keys(errors).length === 0);
    };

    validateFields();
  }, [formData]);

  const isValidNumber = (number) => {
    const pattern = /^\d{3}-\d{4}$/;
    return pattern.test(number);
  };

  const isValidURL = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*\\/?$",
      "i"
    );
    return pattern.test(url);
  };

  return (
    <div className={styles.modalBackground}>
      <form onSubmit={handleSubmit} className={styles.modalContainer}>
        <div className={styles.modalContainerContent}>
          <div className={styles.modalSection}>
            <label style={{ fontWeight: "700", fontSize: "20px" }}>
              Número do Edital *
            </label>
            <TextField
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Ex: 002-2024"
              className={styles.textInput}
              fullWidth
              error={!!fieldErrors.number}
              helperText={fieldErrors.number}
            />
            <label style={{ fontWeight: "700", fontSize: "20px" }}>
              Data de Publicação do Edital *
            </label>
            <div className={styles.dateRange}>
              <TextField
                type="date"
                name="publicationDate"
                value={formData.publicationDate}
                onChange={handleChange}
                className={styles.textInput}
                fullWidth
                error={!!fieldErrors.publicationDate}
                helperText={fieldErrors.publicationDate}
              />
            </div>
          </div>
          <div className={styles.modalSection}>
            <label style={{ fontWeight: "700", fontSize: "20px" }}>
              Prazo para Entrega da Documentação *
            </label>
            <div className={styles.dateRange}>
              <label>De</label>
              <TextField
                type="date"
                name="documentationDeadlineFrom"
                value={formData.documentationDeadlineFrom}
                onChange={handleChange}
                className={styles.textInput}
                fullWidth
                error={!!fieldErrors.documentationDeadlineFrom}
                helperText={fieldErrors.documentationDeadlineFrom}
                inputProps={{
                  max: formData.documentationDeadlineTo || undefined,
                }}
              />
              <label>Até</label>
              <TextField
                type="date"
                name="documentationDeadlineTo"
                value={formData.documentationDeadlineTo}
                onChange={handleChange}
                className={styles.textInput}
                fullWidth
                error={!!fieldErrors.documentationDeadlineTo}
                helperText={fieldErrors.documentationDeadlineTo}
                inputProps={{
                  min: formData.documentationDeadlineFrom || undefined,
                  max: formData.proposalAnalysisTo || undefined,
                }}
              />
            </div>
            <label style={{ fontWeight: "700", fontSize: "20px" }}>
              Prazo para Análise das Propostas *
            </label>
            <div className={styles.dateRange}>
              <label>De</label>
              <TextField
                type="date"
                name="proposalAnalysisFrom"
                value={formData.proposalAnalysisFrom}
                onChange={handleChange}
                className={styles.textInput}
                fullWidth
                error={!!fieldErrors.proposalAnalysisFrom}
                helperText={fieldErrors.proposalAnalysisFrom}
                inputProps={{
                  max: formData.proposalAnalysisTo || undefined,
                  min: formData.documentationDeadlineFrom || undefined
                }}
              />
              <label>Até</label>
              <TextField
                type="date"
                name="proposalAnalysisTo"
                value={formData.proposalAnalysisTo}
                onChange={handleChange}
                className={styles.textInput}
                fullWidth
                error={!!fieldErrors.proposalAnalysisTo}
                helperText={fieldErrors.proposalAnalysisTo}
                inputProps={{ min: formData.proposalAnalysisFrom || undefined }}
              />
            </div>
            <label style={{ fontWeight: "700", fontSize: "20px" }}>
              Homologação do Resultado *
            </label>
            <TextField
              type="date"
              name="resultApproval"
              value={formData.resultApproval}
              onChange={handleChange}
              className={styles.textInput}
              style={{ width: "50%" }}
              fullWidth
              error={!!fieldErrors.resultApproval}
              helperText={fieldErrors.resultApproval}
            />
            <label style={{ fontWeight: "700", fontSize: "20px" }}>
              Publicação do Resultado *
            </label>
            <TextField
              type="date"
              name="resultPublication"
              value={formData.resultPublication}
              onChange={handleChange}
              className={styles.textInput}
              style={{ width: "50%" }}
              fullWidth
              error={!!fieldErrors.resultPublication}
              helperText={fieldErrors.resultPublication}
            />
          </div>
          <div className={styles.modalSectionLinks}>
            <label style={{ fontWeight: "700", fontSize: "20px" }}>
              Link do Edital *
            </label>
            <TextField
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Insira o link do edital"
              className={styles.textInput}
              fullWidth
              error={!!fieldErrors.link}
              helperText={fieldErrors.link}
            />
            <label style={{ fontWeight: "700", fontSize: "20px" }}>
              Retificações
            </label>
            {formData.rectifications.map((rectification, index) => (
              <TextField
                key={index}
                type="text"
                value={rectification}
                onChange={(e) =>
                  handleRectificationChange(index, e.target.value)
                }
                placeholder="Insira o link da retificação"
                className={styles.textInput}
                fullWidth
                error={!!fieldErrors[`rectifications-${index}`]}
                helperText={fieldErrors[`rectifications-${index}`]}
              />
            ))}
            <Button type="button" onClick={addRectification}>
              Adicionar Retificação
            </Button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "50px" }}>
          <Button
            type="submit"
            disabled={!isFormValid}
            color={!isFormValid ? "#bfbfbf" : "#046708"}
          >
            {editData ? "Salvar" : "Cadastrar"}
          </Button>
          <Button type="button" color="#af0a0a" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModalNotice;
