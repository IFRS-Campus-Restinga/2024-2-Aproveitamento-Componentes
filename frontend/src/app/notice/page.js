"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./notice.module.css";
import ModalNotice from "@/components/Modal/ModalNotice/page";
import { noticeList } from "@/services/NoticeService";
import AuthService from "@/services/AuthService";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { Button } from "@/components/Button/button";
import Toast from "@/utils/toast";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({});

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticeList();
        setNotices(data);
        setFilteredNotices(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticeList();
        setNotices(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotices();
  }, [modal]);

  useEffect(() => {
    const applyFilter = () => {
      if (!searchFilter) {
        setFilteredNotices(notices);
        return;
      }

      const lowerSearch = searchFilter.toLowerCase();
      const filtered = notices.filter((notice) =>
        Object.values(notice).some((value) =>
          value?.toString().toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredNotices(filtered);
    };

    applyFilter();
  }, [searchFilter, notices]);

  const openModalForEdit = (notice) => {
    setEditData(notice);
    setModal(true);
  };

  const closeModal = () => {
    setEditData(null);
    setModal(false);
  };

  const clearFilters = () => {
    setSearchFilter("");
    setFilteredNotices(notices);
  };

  const response = (responseModal) => {
    const messages = {
      edit: "Edital atualizado com sucesso!",
      create: "Edital criado com sucesso!",
      error: "Erro ao enviar os dados. Tente novamente.",
    };
  
    setToast(true);
    setToastMessage({
      type: responseModal === "error" ? "error" : "success",
      text: messages[responseModal],
    });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Pesquisar..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className={styles.filterInput}
        />
        <Button onClick={clearFilters} color={"#46b5ff"}>
          Limpar
        </Button>
      </div>
      <div className={styles.scrollableTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Edital</th>
              <th>Ano de Publicação</th>
              <th>Inicio</th>
              <th>Fim</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotices.map((notice) => (
              <tr key={notice.id} onClick={() => openModalForEdit(notice)}>
                <td>{notice.number ?? "N/A"}</td>
                <td>{useDateFormatter(notice.publication_date) ?? "N/A"}</td>
                <td>
                  {useDateFormatter(notice.documentation_submission_start) ??
                    "N/A"}
                </td>
                <td>
                  {useDateFormatter(notice.documentation_submission_end) ??
                    "N/A"}
                </td>
                <td>{notice.link ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setModal(true)} className={styles.addButton}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </button>
      {modal && (
        <ModalNotice
          onClose={closeModal}
          editData={editData}
          response={response}
        />
      )}
      {toast ? <Toast type={toastMessage.type}>{toastMessage.text}</Toast> : ""}
    </div>
  );
};

export default Notice;
