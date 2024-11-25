"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./notice.module.css";
import ModalNotice from "@/components/Modal/ModalNotice/page";
import { noticeList } from "@/services/NoticeService";
import AuthService from "@/services/AuthService";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { Button } from "@/components/Button/button";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [filter, setFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);

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
    const applyFilters = () => {
      let filtered = notices;

      if (filter) {
        filtered = filtered.filter((notice) =>
          notice.number?.toLowerCase().includes(filter.toLowerCase()) ||
          notice.publication_date.includes(filter) ||
          notice.link?.toLowerCase().includes(filter.toLowerCase())
        );
      }
      setFilteredNotices(filtered);
    };

    applyFilters();
  }, [filter, notices]);

  const openModalForEdit = (notice) => {
    setEditData(notice);
    setModal(true);
  };

  const closeModal = () => {
    setEditData(null);
    setModal(false);
  };

  const clearFilters = () => {
    setFilter("");
    setFilteredNotices(notices);
  };

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Editais</h1>
      </div>
      <div className={styles.filters}>
        <div className={styles.filterInputWrapper}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Filtrar..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterInput}
          />
        </div>
        <Button onClick={clearFilters} className={styles.clearButton}>
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
      {modal && <ModalNotice onClose={closeModal} editData={editData} />}
    </div>
  );
};

export default Notice;
