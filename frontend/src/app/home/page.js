"use client";
import { useAuth } from "@/context/AuthContext";
import styles from "./home.module.css";
import { useEffect, useState } from "react";
import Toast from "@/utils/toast";
import { noticeList } from "@/services/NoticeService";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { baseURL } from "@/libs/api";
import Requests from "../requests/page";
import { useRouter } from "next/navigation";

const Home = () => {
  const { user } = useAuth();
  const [lastNotice, setLastNotice] = useState(null);
  const [knowledgeCertifications, setKnowledgeCertifications] = useState([]);
  const [recognitionOfPriorLearning, setRecognitionOfPriorLearning] = useState(
    []
  );
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({});
  const router = useRouter();
  const [mergedRequests, setMergedRequests] = useState([]);

  const isNoticeOpen = () => {
    if (!lastNotice) return false;

    const now = new Date();
    const startDate = new Date(lastNotice.documentation_submission_start);
    const endDate = new Date(lastNotice.documentation_submission_end);

    return now >= startDate && now <= endDate;
  };

  const handleDetailsClick = (item) => {
    if (router) {
      const path =
        item.type === "recognition"
          ? `/requests/details/recognition-forms/${item.id}/`
          : `/requests/details/knowledge-certifications/${item.id}/`;
      router.push(path);
    }
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

    const merged = [...knowledgeCertifications, ...recognitionOfPriorLearning];

    merged.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));

    setMergedRequests(merged);

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
      {user.type === "Estudante" ?
        <>
          {mergedRequests.length !== 0 ? (
            <div className={styles.requestInfoContainer}>
              <h2 style={{ whiteSpace: "nowrap" }}>Solicitações</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Disciplina</th>
                    <th>Status</th>
                    <th>Data de Criação</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedRequests.map((item) => (
                    <tr key={item.id}>
                      <td>{item.discipline_name || "-"}</td>
                      <td>{item.status_display || "-"}</td>
                      <td>{new Date(item.create_date).toLocaleDateString("pt-BR")}</td>
                      <td>
                        {item.type === "knowledge"
                          ? "Certificação de Conhecimento"
                          : "Aproveitamento de Estudos"}
                      </td>
                      <td>
                        <button className={styles.button} onClick={() => handleDetailsClick(item)}>
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.requestInfoContainer}>
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
        </>
        :
        <Requests />
      }
      {toast ? <Toast type={toastMessage.type}>{toastMessage.text}</Toast> : ""}
    </div>
  );
};

export default Home;