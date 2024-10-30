"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./notice.module.css";
import ModalNotice from "@/components/Modal/ModalNotice/page";
import { noticeList } from "@/services/NoticeService";
import AuthService from "@/services/AuthService";

const Notice = () => {
  const [notices, setNotices] = useState();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticeList();
        console.log(data);
        setNotices(data);
      } catch (err) {
        console.log(err);
        setError(err.message || "An error occurred while fetching users.");
      }
    };

    fetchNotices();
  }, []);

  const addNotice = () => {
    // Lógica para adicionar novo edital, se desejar
    console.log("Adicionar novo edital");
  };

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.scrollableTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ano</th>
              <th>Inicio</th>
              <th>Fim</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notices, index) => (
              <tr key={index}>
                <td>{notices.publication_date ?? "N/A"}</td>
                <td>{notices.documentation_submission_start ?? "N/A"}</td>
                <td>{notices.documentation_submission_end ?? "N/A"}</td>
                <td>{notices.Link ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setModal(true)} className={styles.addButton}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </button>
      {modal && <ModalNotice onClose={() => setModal(false)} />}
    </div>
  );
};

export default Notice;
