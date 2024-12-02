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
import RequestService from "@/services/RequestService";

const Home = () => {
  const { user } = useAuth();
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({});
  const router = useRouter();
  const [mergedRequests, setMergedRequests] = useState([]);

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
    const fetchData = async () => {
      try {
        let kcResponse, rplResponse;

        if (user.type === "Estudante" || user.type === "Professor") {
          // Buscar requests filtradas por ID do usuário
          [kcResponse, rplResponse] = await Promise.all([
            RequestService.GetKnowledgeCertificationsById(user.id),
            RequestService.GetRecognitionOfPriorLearningById(user.id),
          ]);
        } else {
          // Buscar todas as requests sem filtro
          [kcResponse, rplResponse] = await Promise.all([
            RequestService.GetKnowledgeCertifications(),
            RequestService.GetRecognitionOfPriorLearning(),
          ]);
        }

        const knowledgeCertifications = kcResponse.data.map((item) => ({
          ...item,
          type: "knowledge",
        }));
        const recognitionOfPriorLearning = rplResponse.data.map((item) => ({
          ...item,
          type: "recognition",
        }));

        const merged = [
          ...knowledgeCertifications,
          ...recognitionOfPriorLearning,
        ];

        merged.sort(
          (a, b) => new Date(b.create_date) - new Date(a.create_date)
        );

        setMergedRequests(merged);
      } catch (error) {
        setToast(true);
        setToastMessage({
          type: "error",
          text: "Erro ao carregar as solicitações",
        });
      }
    };

    fetchData();
  }, [user]);

  const closeToast = () => {
    setToast(false);
  };

  return (
    <div className={styles.homeContainer}>
      {(user.type === "Estudante" || user.type === "Professor") ? (
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
                      <td>
                        {new Date(item.create_date).toLocaleDateString("pt-BR")}
                      </td>
                      <td>
                        {item.type === "knowledge"
                          ? "Certificação de Conhecimento"
                          : "Aproveitamento de Estudos"}
                      </td>
                      <td>
                        <button
                          className={styles.button}
                          onClick={() => handleDetailsClick(item)}
                        >
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
        </>
      ) : (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Requests />
        </div>
      )}
      {toast ? (
        <Toast type={toastMessage.type} close={closeToast}>
          {toastMessage.text}
        </Toast>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
