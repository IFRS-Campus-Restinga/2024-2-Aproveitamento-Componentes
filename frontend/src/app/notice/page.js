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

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [numberFilter, setNumberFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [linkFilter, setLinkFilter] = useState("");
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

      if (numberFilter) {
        filtered = filtered.filter((notice) =>
          notice.number?.toLowerCase().includes(numberFilter.toLowerCase())
        );
      }
      if (yearFilter) {
        filtered = filtered.filter((notice) =>
          notice.publication_date.includes(yearFilter)
        );
      }
      if (linkFilter) {
        filtered = filtered.filter((notice) =>
          notice.link?.toLowerCase().includes(linkFilter.toLowerCase())
        );
      }
      setFilteredNotices(filtered);
    };

    applyFilters();
  }, [numberFilter, yearFilter, linkFilter, notices]);

  const openModalForEdit = (notice) => {
    setEditData(notice);
    setModal(true);
  };

  const closeModal = () => {
    setEditData(null);
    setModal(false);
  };

  const clearFilters = () => {
    setNumberFilter("");
    setYearFilter("");
    setLinkFilter("");
    setFilteredNotices(notices);
  };

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Filtrar por edital..."
          value={numberFilter}
          onChange={(e) => setNumberFilter(e.target.value)}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Filtrar por ano..."
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Filtrar por link..."
          value={linkFilter}
          onChange={(e) => setLinkFilter(e.target.value)}
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
      {modal && <ModalNotice onClose={closeModal} editData={editData} />}
    </div>
  );
};

export default Notice;
