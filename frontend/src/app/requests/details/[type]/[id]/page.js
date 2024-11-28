"use client";

import { apiClient, baseURL } from "@/libs/api";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { default as Stepper } from "@/components/Stepper/stepper";
import styles from "./details.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClock,
  faEdit,
  faSave,
  faTimes,
  faAsterisk,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "primereact/button";
import {
  getEnumIndexByValue,
  getFailed,
  getStatus,
  getStep1Status,
  getStep2Status,
  getStep3Status,
  getStep4Status,
  getStep5Status,
  getSucceeded,
  StatusEnum,
} from "@/app/requests/status";
import RequestService from "@/services/RequestService";
import { TextField } from "@mui/material";
import Modal from "@/components/Modal/ModalRequest/modal";

const Details = () => {
  const [details, setDetails] = useState(null);
  const [stepsStatus, setStepsStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingKnowledge, setIsEditingKnowledge] = useState(false);
  const [isEditingCourseWorkload, setisEditingCourseWorkload] = useState(false);
  const [isEditingCourseStudiedWorkload, setIsEditingCourseStudiedWorkload] =
    useState(false);
  const [isEditingTestScore, setIsEditingTestScore] = useState(false);
  const [editedKnowledge, setEditedKnowledge] = useState("");
  const [editedCourseWorkload, setEditedCourseWorkload] = useState("");
  const [editedSchedulingDate, setEditedSchedulingDate] = useState("");
  const [editedCourseStudiedWorkload, setEditedCourseStudiedWorkload] =
    useState("");
  const [professor, setProfessor] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [availableProfessors, setAvailableProfessors] = useState([]);
  const [coordinatorFeedback, setCoordinatorFeedback] = useState("");
  const [professorFeedback, setProfessorFeedback] = useState("");
  const [coordinatorSecondFeedback, setCoordinatorSecondFeedback] =
    useState("");
  const [creFeedback, setCreFeedback] = useState("");
  const [editedTestScore, setEditedTestScore] = useState("");
  const [hasChangesKnowledge, setHasChangesKnowledge] = useState(false);
  const [hasChangesWorkload, setHasChangesWorkload] = useState(false);
  const [hasChangesStudiedWorkload, setHasChangesStudiedWorkload] =
    useState(false);
  const [hasChangesTestScore, setHasChangesTestScore] = useState(false);
  const [disableReactivity, setDisableReactivity] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const role = user.type;
  const editableRef = useRef(null);
  const segments = pathname.split("/");
  const id = segments.at(-1);
  const type = segments.at(-2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("pending");

  const fetchDetails = async () => {
    try {
      const response = await apiClient.get(`${baseURL}/forms/${type}/${id}/`);
      if (response.status !== 200) throw new Error("Erro ao buscar detalhes");
      const data = await response.data;
      setDetails(data);
      setStepsStatus([
        getStepStatus(data.steps, getStep1Status),
        getStepStatus(data.steps, getStep2Status),
        getStepStatus(data.steps, getStep3Status),
        getStepStatus(data.steps, getStep4Status),
        getStepStatus(data.steps, getStep5Status),
      ]);
      setEditedKnowledge((prev) =>
        prev ? prev : data.previous_knowledge || "",
      );
      setEditedCourseWorkload((prev) =>
        prev ? prev : data.course_workload || "",
      );
      setEditedCourseStudiedWorkload((prev) =>
        prev ? prev : data.course_studied_workload || "",
      );
      setEditedTestScore((prev) =>
        prev !== "" ? prev : data.test_score || "",
      );

      const step2Feedback = getStepStatus(data.steps, getStep2Status);
      const step3Feedback = getStepStatus(data.steps, getStep3Status);
      const step4Feedback = getStepStatus(data.steps, getStep4Status);
      const step5Feedback = getStepStatus(data.steps, getStep5Status);

      if (step2Feedback) setCoordinatorFeedback(step2Feedback.feedback);
      if (step3Feedback) setProfessorFeedback(step3Feedback.feedback);
      if (step4Feedback) setCoordinatorSecondFeedback(step4Feedback.feedback);
      if (step5Feedback) setCreFeedback(step5Feedback.feedback);

      if (
        role === "Coordenador" &&
        data.status_display === "Em análise do Coordenador"
      ) {
        console.log("user id - " + user.id);
        const professorsResponse = await apiClient.get(
          `${baseURL}/courses/professors/${user.id}`,
        );
        if (professorsResponse.status !== 200)
          throw new Error("Erro ao buscar detalhes");

        const professorsData = await professorsResponse.data;
        setAvailableProfessors(professorsData);
        console.log("professors data - " + professorsData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!disableReactivity && id && type) {
      fetchDetails();
    } else {
      setLoading(false);
    }
  }, [pathname, disableReactivity]);

  const getStepStatus = (stepArray, stepStatusFunc) => {
    const reverseArray = (stepArray) => [...stepArray].reverse();
    return reverseArray(stepArray).find((value) =>
      stepStatusFunc().includes(value.status_display),
    );
  };

  const createStep = async (status, feedback) => {
    try {
      const formType =
        type === "knowledge-certifications"
          ? "certification_form"
          : "recognition_form";

      const body = {
        status: status,
        feedback: [feedback].toString(),
        [formType]: details.id,
      };

      if (status === "PROF") {
        body.responsible_id = Number(selectedProfessor);
      }

      const response = await apiClient.post(`${baseURL}/forms/steps/`, JSON.stringify(body));

      if (response.status !== 201)
        throw new Error("Erro ao alterar solicitação");

      await fetchDetails();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSelectedProfessor = async (prof) => {
    setSelectedProfessor(prof);
  };

  const openModal = (status) => {
    setStatus(status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = (feedback) => {
    let fb;
    if (feedback) {
      fb = feedback.toString();
    }
    createStep(getStatus(status), fb).then((value) => {
      if (
        getSucceeded().includes(status) &&
        status !== "Aprovado pelo Ensino"
      ) {
        const index = getEnumIndexByValue(status) + 1;
        createStep(getStatus(StatusEnum[index]), "Pendente");
      }
    });
    console.log("Feedback enviado:", feedback);
    closeModal();
  };

  const handleDownloadAttachment = async (attachmentId) => {
    await RequestService.DownloadAttachment(attachmentId);
  };

  const handleEditToggleKnowledge = () => {
    setIsEditingKnowledge(!isEditingKnowledge);
    setDisableReactivity(!isEditingKnowledge);
  };
  const handleEditToggleCourseWorkload = () => {
    setisEditingCourseWorkload(!isEditingCourseWorkload);
    setDisableReactivity(!isEditingCourseWorkload);
  };
  const handleEditToggleCourseStudiedWorkload = () => {
    setIsEditingCourseStudiedWorkload(!isEditingCourseStudiedWorkload);
    setDisableReactivity(!isEditingCourseStudiedWorkload);
  };
  const handleEditToggleTestScore = () => {
    setIsEditingTestScore(!isEditingTestScore);
    setDisableReactivity(!isEditingTestScore);
  };

  const handleInput = (e, field) => {
    let newValue = e.target.textContent;

    if (
      field === "course_workload" ||
      field === "course_studied_workload" ||
      field === "test_score"
    ) {
      newValue = newValue.replace(/[^0-9]/g, "");
    }

    if (newValue.length > 255) {
      newValue = newValue.slice(0, 255);
      e.currentTarget.textContent = newValue;
    }

    if (field === "previous_knowledge") {
      setEditedKnowledge(newValue);
      if (newValue !== details.previous_knowledge) {
        setHasChangesKnowledge(true);
      }
    } else if (field === "course_workload") {
      setEditedCourseWorkload(newValue);
      if (newValue !== details.course_workload) {
        setHasChangesWorkload(true);
      }
    } else if (field === "course_studied_workload") {
      setEditedCourseStudiedWorkload(newValue);
      if (newValue !== details.course_studied_workload) {
        setHasChangesStudiedWorkload(true);
      }
    } else if (field === "test_score") {
      setEditedTestScore(newValue);
      if (newValue !== details.test_score) {
        setHasChangesTestScore(true);
      }
    }
  };

  const handleSave = async (field) => {
    try {
      let updatedData;

      switch (field) {
        case "previous_knowledge":
          updatedData = { previous_knowledge: editedKnowledge };
          break;
        case "course_workload":
          updatedData = { course_workload: editedCourseWorkload };
          break;
        case "course_studied_workload":
          updatedData = {
            course_studied_workload: editedCourseStudiedWorkload,
          };
          break;
        case "test_score":
          updatedData = { test_score: editedTestScore };
          break;
        case "scheduling_date":
          updatedData = { scheduling_date: editedSchedulingDate };
          break;
      }

      const body = JSON.stringify(updatedData);

      const response = await apiClient.patch(
        `${baseURL}/forms/${type}/${id}/`,
        body,
      );

      if (response.status !== 200) throw new Error("Erro ao salvar alterações");

      switch (field) {
        case "previous_knowledge":
          setHasChangesKnowledge(false);
          setIsEditingKnowledge(false);
          break;
        case "course_workload":
          setHasChangesWorkload(false);
          setisEditingCourseWorkload(false);
          break;
        case "course_studied_workload":
          setHasChangesStudiedWorkload(false);
          setIsEditingCourseStudiedWorkload(false);
          break;
        case "test_score":
          setHasChangesTestScore(false);
          setIsEditingTestScore(false);
          break;
      }

      setDisableReactivity(false);

      setDetails((prevDetails) => ({
        ...prevDetails,
        ...updatedData,
      }));
    } catch (error) {
      setError("Erro ao salvar alterações");
    } finally {
      setEditedKnowledge("");
      setEditedCourseWorkload("");
      setEditedSchedulingDate("");
      setEditedCourseStudiedWorkload("");
      setEditedTestScore("");
    }
  };

  const handleBack = () => {
    router.push("/requests");
  };

  const getStatusProps = (step) => {
    let status = stepsStatus[step];

    if (status) status = status.status_display;
    console.log("step " + step + " - " + status);

    if (getFailed().includes(status)) {
      return { color: "red", icon: faTimes, label: "Rejeitado" };
    } else if (getSucceeded().includes(status)) {
      return { color: "green", icon: faCheck, label: "Aprovado" };
    } else {
      return { color: "yellow", icon: faClock, label: "Pendente" };
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDateChange = (e) => {
    const { value } = e.target;
    setEditedSchedulingDate(value);
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.center_title}>Detalhes da Solicitação</h1>
        {details ? (
          <div>
            {stepsStatus && details.status_display !== "Cancelado" ? (
              <Stepper stepsStatus={stepsStatus} />
            ) : (
              <div className={styles.centered}>
                <div className={`${styles.statusContainer} ${styles.red}`}>
                  <strong>Status: </strong>
                  <div className={styles.statusButton}>
                    <FontAwesomeIcon icon={faTimes} />
                    {"Cancelado pelo aluno"}
                  </div>
                </div>
              </div>
            )}
            {role === "Estudante" &&
              details.status_display === "Em análise do Ensino" && (
                <div className={styles.centered}>
                  <Button
                    label="Cancelar solicitação"
                    icon="pi pi-times"
                    onClick={() => createStep("CANCELED")}
                    className={styles.pButtonDanger}
                  />
                </div>
              )}
            <div className={styles.analysis}>
              <h1 className={styles.center_title}>Análise do Ensino</h1>
              <div className={styles.columns}>
                <div className={styles.infoColumn}>
                  <p className={styles.info}>
                    <strong>Aluno: </strong>
                    {details.student_name}
                  </p>
                  <p className={styles.info}>
                    <strong>E-mail: </strong>
                    {details.student_email}
                  </p>
                  <p className={styles.info}>
                    <strong>Matrícula: </strong>
                    {details.student_matricula}
                  </p>
                  <p className={styles.info}>
                    <strong>Curso: </strong>
                    {details.student_course}
                  </p>
                  <p className={styles.info}>
                    <strong>Componente curricular: </strong>
                    {details.discipline_name}
                  </p>
                  {details.attachments && details.attachments.length > 0 && (
                    <div className={styles.attachmentsSection}>
                      <h3>Anexos</h3>
                      <ul className={styles.attachmentsList}>
                        {details.attachments.map((attachment) => (
                          <li
                            key={attachment.id}
                            className={styles.attachmentItem}
                          >
                            <div className={styles.attachmentItemContent}>
                              <span>{attachment.file_name}</span>
                              <Button
                                icon="pi pi-download"
                                className="p-button-text p-button-rounded"
                                onClick={() =>
                                  handleDownloadAttachment(attachment.id)
                                }
                                tooltip="Baixar Anexo"
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {type === "knowledge-certifications" && (
                    <div className={styles.infoField}>
                      <strong className={styles.info}>
                        Experiência anterior:{" "}
                      </strong>
                      <span
                        ref={editableRef}
                        contentEditable={isEditingKnowledge}
                        suppressContentEditableWarning={true}
                        className={`${styles.editableSpan} ${isEditingKnowledge ? styles.editing : ""}`}
                        onInput={(e) => handleInput(e, "previous_knowledge")}
                      >
                        {details.previous_knowledge || "Pendente"}
                      </span>
                      {role === "Estudante" &&
                        details.status_display === "Em análise do Ensino" && (
                          <>
                            <FontAwesomeIcon
                              icon={faEdit}
                              onClick={handleEditToggleKnowledge}
                              className={`${styles.iconSpacing} ${styles.editIcon}`}
                            />
                            {isEditingKnowledge && hasChangesKnowledge && (
                              <FontAwesomeIcon
                                icon={faSave}
                                onClick={() => handleSave("previous_knowledge")}
                                className={`${styles.iconSpacing} ${styles.saveIcon}`}
                              />
                            )}
                          </>
                        )}
                    </div>
                  )}

                  {type === "recognition-forms" && (
                    <>
                      <div className={styles.infoField}>
                        <strong className={styles.info}>Carga horária: </strong>
                        <span
                          ref={editableRef}
                          contentEditable={isEditingCourseWorkload}
                          suppressContentEditableWarning={true}
                          className={`${styles.editableSpan} ${isEditingCourseWorkload ? styles.editing : ""}`}
                          onInput={(e) => handleInput(e, "course_workload")}
                        >
                          {details.course_workload || "Pendente"}
                        </span>
                        {role === "Estudante" &&
                          details.status_display === "Em análise do Ensino" && (
                            <>
                              <FontAwesomeIcon
                                icon={faEdit}
                                onClick={handleEditToggleCourseWorkload}
                                className={`${styles.iconSpacing} ${styles.editIcon}`}
                              />
                              {isEditingCourseWorkload &&
                                hasChangesWorkload && (
                                  <FontAwesomeIcon
                                    icon={faSave}
                                    onClick={() =>
                                      handleSave("course_workload")
                                    }
                                    className={`${styles.iconSpacing} ${styles.saveIcon}`}
                                  />
                                )}
                            </>
                          )}
                      </div>
                      <div className={styles.infoField}>
                        <strong className={styles.info}>
                          Carga horária efetiva:{" "}
                        </strong>
                        <span
                          ref={editableRef}
                          contentEditable={isEditingCourseStudiedWorkload}
                          suppressContentEditableWarning={true}
                          className={`${styles.editableSpan} ${isEditingCourseStudiedWorkload ? styles.editing : ""}`}
                          onInput={(e) =>
                            handleInput(e, "course_studied_workload")
                          }
                        >
                          {details.course_studied_workload || "Pendente"}
                        </span>
                        {role === "Estudante" &&
                          details.status_display === "Em análise do Ensino" && (
                            <>
                              <FontAwesomeIcon
                                icon={faEdit}
                                onClick={handleEditToggleCourseStudiedWorkload}
                                className={`${styles.iconSpacing} ${styles.editIcon}`}
                              />
                              {isEditingCourseStudiedWorkload &&
                                hasChangesStudiedWorkload && (
                                  <FontAwesomeIcon
                                    icon={faSave}
                                    onClick={() =>
                                      handleSave("course_studied_workload")
                                    }
                                    className={`${styles.iconSpacing} ${styles.saveIcon}`}
                                  />
                                )}
                            </>
                          )}
                      </div>
                    </>
                  )}
                </div>
                {details.status_display !== "Cancelado" && (
                  <div className={styles.actionColumn}>
                    <div
                      className={`${styles.statusContainer} ${styles[getStatusProps(0).color]}`}
                    >
                      <strong>Status: </strong>
                      <div className={styles.statusButton}>
                        <FontAwesomeIcon icon={getStatusProps(0).icon} />
                        {getStatusProps(0).label}
                      </div>
                    </div>

                    {role === "Ensino" &&
                      details.status_display === "Em análise do Ensino" && (
                        <div className={styles.actionButtons}>
                          <Button
                            label="Aprovar"
                            icon="pi pi-check"
                            onClick={() => openModal("Analisado pelo Ensino")}
                            className={styles.pButtonSuccess}
                          />
                          <Button
                            label="Rejeitar"
                            icon="pi pi-times"
                            onClick={() => openModal("Cancelado pelo Ensino")}
                            className={styles.pButtonDanger}
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
            {Object.values(details.steps)
              .reverse()
              .find((value) =>
                getStep2Status().includes(value.status_display),
              ) && (
              <div className={styles.analysis}>
                <h1 className={styles.center_title}>Análise do Coordenador</h1>
                <div className={styles.columns}>
                  <div className={styles.infoColumn}>
                    {role === "Coordenador" &&
                      details.status_display ===
                        "Em análise do Coordenador" && (
                        <div className={styles.selector_container}>
                          <select
                            className={styles.selector}
                            onChange={(e) =>
                              handleSelectedProfessor(e.target.value)
                            }
                          >
                            <option value="">Selecione um Professor</option>
                            {availableProfessors.map((prof) => (
                              <option key={prof.id} value={prof.id}>
                                {prof.name}
                              </option>
                            ))}
                          </select>
                          <FontAwesomeIcon
                            icon={faAsterisk}
                            className={`${styles.iconSpacing} ${styles.asterisk}`}
                          />
                        </div>
                      )}
                    <p className={styles.info}>
                      <strong>Professor responsável: </strong>
                      {professor || "Pendente"}
                    </p>
                    <p className={styles.info}>
                      <strong>Parecer do coordenador: </strong>
                      {coordinatorFeedback || "Pendente"}
                    </p>
                  </div>
                  <div className={styles.actionColumn}>
                    {details.status_display !== "Cancelado" && (
                      <div
                        className={`${styles.statusContainer} ${styles[getStatusProps(1).color]}`}
                      >
                        <strong>Status: </strong>
                        <div className={styles.statusButton}>
                          <FontAwesomeIcon icon={getStatusProps(1).icon} />
                          {getStatusProps(1).label}
                        </div>
                      </div>
                    )}
                    {role === "Coordenador" &&
                      details.status_display ===
                        "Em análise do Coordenador" && (
                        <div className={styles.actionButtons}>
                          {selectedProfessor && (
                            <Button
                              label="Aprovar"
                              icon="pi pi-check"
                              onClick={() =>
                                openModal("Analisado pelo Coordenador")
                              }
                              className={styles.pButtonSuccess}
                            />
                          )}
                          <Button
                            label="Rejeitar"
                            icon="pi pi-times"
                            onClick={() =>
                              openModal("Cancelado pelo Coordenador")
                            }
                            className={styles.pButtonDanger}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
            {Object.values(details.steps)
              .reverse()
              .find((value) =>
                getStep3Status().includes(value.status_display),
              ) && (
              <div className={styles.analysis}>
                <h1 className={styles.center_title}>Análise do Professor</h1>
                <div className={styles.columns}>
                  <div className={styles.infoColumn}>
                    {type === "knowledge-certifications" &&
                      !details.scheduling_date &&
                      role === "Professor" && (
                        <div className={styles.date_time_container}>
                          <p className={styles.info}>
                            <strong>Agendar prova: </strong>
                          </p>
                          <TextField
                            className={styles.date_time}
                            type="datetime-local"
                            name="schedulingDate"
                            value={editedSchedulingDate}
                            onChange={handleDateChange}
                            fullWidth
                            slotProps={{
                              htmlInput: {
                                min: new Date(
                                  new Date().getTime() + 24 * 60 * 60 * 1000,
                                )
                                  .toISOString()
                                  .slice(0, 16),
                              },
                            }}
                          />
                          {editedSchedulingDate !== "" && (
                            <div className={styles.iconSpacing}>
                              <FontAwesomeIcon
                                icon={faSave}
                                onClick={() => handleSave("scheduling_date")}
                                className={`${styles.iconSpacing} ${styles.saveIcon}`}
                              />
                              <span
                                className={styles.saveIcon}
                                onClick={() => handleSave("scheduling_date")}
                              >
                                Agendar
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                    {type === "knowledge-certifications" && (
                      <p className={styles.info}>
                        <strong>Data da prova: </strong>
                        {details.scheduling_date
                          ? new Date(details.scheduling_date).toLocaleString(
                              "pt-BR",
                            )
                          : "Pendente"}
                      </p>
                    )}

                    {type === "knowledge-certifications" && (
                      <p className={styles.info}>
                        <strong>Avaliação: </strong>
                        <span
                          ref={editableRef}
                          contentEditable={isEditingTestScore}
                          suppressContentEditableWarning={true}
                          className={`${styles.editableSpan} ${isEditingTestScore ? styles.editing : ""}`}
                          onInput={(e) => handleInput(e, "test_score")}
                        >
                          {details.test_score || "Pendente"}
                        </span>
                        {role === "Professor" &&
                          details.status_display ===
                            "Em análise do Professor" && (
                            <>
                              <FontAwesomeIcon
                                icon={faEdit}
                                onClick={handleEditToggleTestScore}
                                className={`${styles.iconSpacing} ${styles.editIcon}`}
                              />
                              {isEditingTestScore && hasChangesTestScore && (
                                <FontAwesomeIcon
                                  icon={faSave}
                                  onClick={() => handleSave("test_score")}
                                  className={`${styles.iconSpacing} ${styles.saveIcon}`}
                                />
                              )}
                            </>
                          )}
                      </p>
                    )}

                    <p className={styles.info}>
                      <strong>Parecer: </strong>
                      {professorFeedback || "Pendente"}
                    </p>
                  </div>
                  <div className={styles.actionColumn}>
                    {details.status_display !== "Cancelado" && (
                      <div
                        className={`${styles.statusContainer} ${styles[getStatusProps(2).color]}`}
                      >
                        <strong>Status: </strong>
                        <div className={styles.statusButton}>
                          <FontAwesomeIcon icon={getStatusProps(2).icon} />
                          {getStatusProps(2).label}
                        </div>
                      </div>
                    )}
                    {(details.status_display === "Em análise do Professor" ||
                      details.status_display ===
                        "Retornado pelo Coordenador") &&
                      role === "Professor" &&
                      (type !== "knowledge-certifications" ||
                        (type === "knowledge-certifications" &&
                          details.test_score &&
                          details.scheduling_date)) && (
                        <div className={styles.actionButtons}>
                          <Button
                            label="Aprovar"
                            icon="pi pi-check"
                            onClick={() =>
                              openModal("Analisado pelo Professor")
                            }
                            className={styles.pButtonSuccess}
                          />
                          <Button
                            label="Rejeitar"
                            icon="pi pi-times"
                            onClick={() =>
                              openModal("Rejeitado pelo Professor")
                            }
                            className={styles.pButtonDanger}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
            {Object.values(details.steps)
              .reverse()
              .find((value) =>
                getStep4Status().includes(value.status_display),
              ) && (
              <div className={styles.analysis}>
                <h1 className={styles.center_title}>
                  Homologação do Coordenador
                </h1>
                <div className={styles.columns}>
                  <div className={styles.infoColumn}>
                    <p className={styles.info}>
                      <strong>Parecer: </strong>
                      {coordinatorSecondFeedback || "Pendente"}
                    </p>
                  </div>
                  <div className={styles.actionColumn}>
                    {details.status_display !== "Cancelado" && (
                      <div
                        className={`${styles.statusContainer} ${styles[getStatusProps(3).color]}`}
                      >
                        <strong>Status: </strong>
                        <div className={styles.statusButton}>
                          <FontAwesomeIcon icon={getStatusProps(3).icon} />
                          {getStatusProps(3).label}
                        </div>
                      </div>
                    )}
                    {(details.status_display ===
                      "Em homologação do Coordenador" ||
                      details.status_display === "Retornado pelo Ensino") &&
                      role === "Coordenador" && (
                        <div className={styles.actionButtons}>
                          <Button
                            label="Aprovar"
                            icon="pi pi-check"
                            onClick={() =>
                              openModal("Aprovado pelo Coordenador")
                            }
                            className={styles.pButtonSuccess}
                          />
                          <Button
                            label="Retornar"
                            icon="pi pi-arrow-left"
                            onClick={() =>
                              openModal("Retornado pelo Coordenador")
                            }
                            className={styles.pButtonReturn}
                          />
                          <Button
                            label="Rejeitar"
                            icon="pi pi-times"
                            onClick={() =>
                              openModal("Rejeitado pelo Coordenador")
                            }
                            className={styles.pButtonDanger}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
            {Object.values(details.steps)
              .reverse()
              .find((value) =>
                getStep5Status().includes(value.status_display),
              ) && (
              <div className={styles.analysis}>
                <h1 className={styles.center_title}>Homologação do Ensino</h1>
                <div className={styles.columns}>
                  <div className={styles.infoColumn}>
                    <p className={styles.info}>
                      <strong>Parecer: </strong>
                      {creFeedback || "Pendente"}
                    </p>
                  </div>
                  <div className={styles.actionColumn}>
                    {details.status_display !== "Cancelado" && (
                      <div
                        className={`${styles.statusContainer} ${styles[getStatusProps(4).color]}`}
                      >
                        <strong>Status: </strong>
                        <div className={styles.statusButton}>
                          <FontAwesomeIcon icon={getStatusProps(4).icon} />
                          {getStatusProps(4).label}
                        </div>
                      </div>
                    )}
                    {role === "Ensino" &&
                      details.status_display === "Em homologação do Ensino" && (
                        <div className={styles.actionButtons}>
                          <Button
                            label="Aprovar"
                            icon="pi pi-check"
                            onClick={() => openModal("Aprovado pelo Ensino")}
                            className={styles.pButtonSuccess}
                          />
                          <Button
                            label="Retornar"
                            icon="pi pi-arrow-left"
                            onClick={() => openModal("Retornado pelo Ensino")}
                            className={styles.pButtonReturn}
                          />
                          <Button
                            label="Rejeitar"
                            icon="pi pi-times"
                            onClick={() => openModal("Rejeitado pelo Ensino")}
                            className={styles.pButtonDanger}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>Nenhum detalhe disponível</div>
        )}
        <Button
          label="Voltar"
          icon="pi pi-arrow-left"
          onClick={handleBack}
          className={styles.backButton}
        />
      </div>
      {isModalOpen && (
        <Modal
          status={status}
          onClose={closeModal}
          onConfirm={handleConfirm}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
};

export default Details;
