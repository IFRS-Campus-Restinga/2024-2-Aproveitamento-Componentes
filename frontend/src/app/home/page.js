"use client";
import { useAuth } from "@/context/AuthContext";
import styles from "./home.module.css";
import { useEffect, useState } from "react";
import Toast from "@/utils/toast";
import { noticeList } from "@/services/NoticeService";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { baseURL } from "@/libs/api";

const Home = () => {
  const { user } = useAuth();
  const [lastNotice, setLastNotice] = useState(null);
  const [knowledgeCertifications, setKnowledgeCertifications] = useState([]);
  const [recognitionOfPriorLearning, setRecognitionOfPriorLearning] = useState(
    []
  );
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({});

  const isNoticeOpen = () => {
    if (!lastNotice) return false;

    const now = new Date();
    const startDate = new Date(lastNotice.documentation_submission_start);
    const endDate = new Date(lastNotice.documentation_submission_end);

    return now >= startDate && now <= endDate;
  };

  useEffect(() => {
    const fetchKnowledgeCertifications = async () => {
      try {
        const response = await fetch(
          `${baseURL}/forms/knowledge-certifications/?student=${user.id}`
        );
        if (!response.ok)
          throw new Error("Erro ao buscar Certificados de Conhecimento");
        const data = await response.json();
        setKnowledgeCertifications(data);
      } catch (error) {
        setToast(true);
        setToastMessage({
          type: "error",
          text: "Não fui possivel buscar as solicitações de certificação",
        });
      }
    };

    const fetchRecognitionOfPriorLearning = async () => {
      try {
        const response = await fetch(
          `${baseURL}/forms/recognition-forms/?student=${user.id}`
        );
        if (!response.ok)
          throw new Error("Erro ao buscar Aproveitamento de Estudos");
        const data = await response.json();
        setRecognitionOfPriorLearning(data);
      } catch (error) {
        setToast(true);
        setToastMessage({
          type: "error",
          text: "Não fui possivel buscar as solicitações de aproveitamento",
        });
      }
    };

    const fetchData = async () => {
      await Promise.all([
        fetchKnowledgeCertifications(),
        fetchRecognitionOfPriorLearning(),
      ]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticeList();
        setLastNotice(
          data
            .sort(
              (a, b) =>
                new Date(b.publication_date) - new Date(a.publication_date)
            )
            .slice(0, 1)[0]
        );
      } catch (err) {
        setToast(true);
        setToastMessage({
          type: "error",
          text: "Não fui possivel buscar os editais",
        });
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className={styles.homeContainer}>
      {knowledgeCertifications.length !== 0 ||
      recognitionOfPriorLearning.length !== 0 ? (
        <div className={styles.requestInfoContainer}>
          <h2 style={{ whiteSpace: "nowrap" }}>Solicitações</h2>
          {knowledgeCertifications !== 0 ? (
            <div>
              <strong>Disciplinas:</strong>
              {knowledgeCertifications.map((certification) => (
                <span>{certification.discipline_name} </span>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3 style={{ opacity: "0.5" }}>
                Você não tem solicitações de Certificação de Conhecimento
              </h3>
            </div>
          )}
          {recognitionOfPriorLearning !== 0 ? (
            <div>
              <strong>Disciplinas:</strong>
              {recognitionOfPriorLearning.map((certification) => (
                <span>{certification.discipline_name} </span>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3 style={{ opacity: "0.5" }}>
                Você não tem solicitações de Aproveitamento de Estudo
              </h3>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3 style={{ opacity: "0.5" }}>Você não tem solicitações</h3>
        </div>
      )}
      {lastNotice ? (
        <div className={styles.noticeInfoContainer}>
          <div className={styles.infoTitle}>
            <h2 style={{ whiteSpace: "nowrap" }}>Último Edital</h2>-
            <p>{useDateFormatter(lastNotice.publication_date)}</p>
            {isNoticeOpen() ? (
              <span style={{ backgroundColor: "#69d95e" }}>Aberto</span>
            ) : (
              <span style={{ backgroundColor: "#f95858" }}>Fechado</span>
            )}
          </div>
          <div className={styles.info}>
            <div>
              <strong>Edital:</strong>
              <span>{lastNotice.number}</span>
            </div>
            <div>
              <strong>Inicio:</strong>
              <span>
                {useDateFormatter(lastNotice.documentation_submission_start)}
              </span>
            </div>
            <div>
              <strong>Fim:</strong>
              <span>
                {useDateFormatter(lastNotice.documentation_submission_end)}
              </span>
            </div>
            <div>
              <strong>Link:</strong>
              <span>{lastNotice.link}</span>
            </div>
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
      {toast ? <Toast type={toastMessage.type}>{toastMessage.text}</Toast> : ""}
    </div>
  );
};

export default Home;
