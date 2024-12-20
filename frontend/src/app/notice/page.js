"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./notice.module.css";
import ModalNotice from "@/components/Modal/ModalNotice/page";
import { noticeList, noticeListAll } from "@/services/NoticeService";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { Button } from "@/components/Button/button";
import Toast from "@/utils/toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useAuth } from "@/context/AuthContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { InputText } from "primereact/inputtext";
import exportToPdf from "../pdf/page";
import RequestDetails from "../pdf/page";
import { Description } from "@mui/icons-material";

const ITEMS_PER_PAGE = 10; // Quantidade de itens por página

const Notice = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [lastNotice, setLastNotice] = useState(null);
  const [allNotices, setAllNotices] = useState(null);

  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({});
  const [expand, setExpand] = useState(false);

  // Fetch notices com paginação
  const fetchNotices = async (page = 1) => {
    try {
      const data = await noticeList({ page, pageSize: ITEMS_PER_PAGE });
      setNotices(data.results);
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
    } catch (err) {
      console.error("Erro ao buscar notices:", err);
    }
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticeListAll();
        setLastNotice(
          data.results
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
    const fetchNotices = async () => {
      try {
        const data = await noticeListAll();
        setAllNotices(data.results[0]);
        console.log(data)
        console.log(data.results)
        console.log(allNotices);
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

  const isNoticeOpen = () => {
    if (!lastNotice) return false;

    const now = new Date();
    const startDate = new Date(lastNotice.documentation_submission_start);
    const endDate = new Date(lastNotice.documentation_submission_end);

    return now >= startDate && now <= endDate;
  };

  const isOtherNoticeOpen = (notice) => {
    if (!notice) return false;

    const now = new Date();
    const startDate = new Date(notice.documentation_submission_start);
    const endDate = new Date(notice.documentation_submission_end);

    return now >= startDate && now <= endDate;
  };

  // Fetch inicial
  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  // Atualiza notices após fechar o modal
  useEffect(() => {
    if (!modal) {
      fetchNotices(currentPage);
    }
  }, [modal]);

  // Handle filtro
  const applyFilters = () => {
    if (filter) {
      return notices.filter(
        (notice) =>
          notice.number?.toLowerCase().includes(filter.toLowerCase()) ||
          notice.publication_date.includes(filter) ||
          notice.link?.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return notices;
  };

  const filteredNotices = applyFilters();

  // Controle de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Modal e toast
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
  };

  const closeToast = () => {
    setToast(false);
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

  const mockTest = {
    title:"teste",
    number: "001-2023",
    description: "teste par pdf",
    date: "24-12-09",
  }

  return user.type !== "Estudante" ? (
    <div className={styles.contentWrapper}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Editais</h1>
      </div>
      <div className={styles.filters}>
        <div className={styles.filterInputWrapper}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <InputText
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
      <div className={styles.tableWrapper}>
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
                <td>
                  <a href={notice.link}>{notice.link ?? "N/A"}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setModal(true)} className={styles.addButton}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </button>
      <div className={styles.paginationContainer}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            backgroundColor: `${currentPage === 1 ? "gray" : "#5299f7"}`,
            cursor: `${currentPage === 1 ? "not-allowed" : "pointer"}`,
          }}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            backgroundColor: `${
              currentPage === totalPages ? "gray" : "#5299f7"
            }`,
            cursor: `${currentPage === totalPages ? "not-allowed" : "pointer"}`,
          }}
        >
          Próxima
        </button>
      </div>
      {modal && (
        <ModalNotice
          onClose={closeModal}
          editData={editData}
          response={response}
        />
      )}
      {toast && (
        <Toast type={toastMessage.type} close={closeToast}>
          {toastMessage.text}
        </Toast>
      )}
    </div>
  ) : (
    <div style={{ padding: "16px" }}>
      <RequestDetails request={mockTest}/>
      <div className={styles.noticeInfoContainer}>
        {lastNotice ? (
          <>
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
                <a href={lastNotice.link}>{lastNotice.link}</a>
              </div>
            </div>
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
      <div className={styles.otherNotices} style={{ marginTop: "32px" }}>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%"
          }}
        >
          <h2>Todos os Editais</h2>
          {expand ? (
            <ExpandLessIcon fontSize="large" cursor="pointer" onClick={() => setExpand(!expand)}/>
          ) : (
            <ExpandMoreIcon fontSize="large" cursor="pointer" onClick={() => setExpand(!expand)}/>
          )}
        </span>
        {expand ? (
          <div style={{ display: "flex", flexFlow: "wrap", gap: "16px", justifyContent: "center" }}>
            {allNotices.map((notice) => (
              <div className={styles.otherNotice}>
                <>
                  <div className={styles.infoTitle}>
                    <h2 style={{ whiteSpace: "nowrap" }}>Edital</h2>-
                    <p>{useDateFormatter(notice.publication_date)}</p>
                    {isOtherNoticeOpen(notice) ? (
                      <span style={{ backgroundColor: "#69d95e" }}>Aberto</span>
                    ) : (
                      <span style={{ backgroundColor: "#f95858" }}>
                        Fechado
                      </span>
                    )}
                  </div>
                  <div className={styles.info}>
                    <div>
                      <strong>Edital:</strong>
                      <span>{notice.number}</span>
                    </div>
                    <div>
                      <strong>Inicio:</strong>
                      <span>
                        {useDateFormatter(
                          notice.documentation_submission_start
                        )}
                      </span>
                    </div>
                    <div>
                      <strong>Fim:</strong>
                      <span>
                        {useDateFormatter(
                          notice.documentation_submission_end
                        )}
                      </span>
                    </div>
                    <div>
                      <strong>Link:</strong>
                      <a href={notice.link}>{notice.link}</a>
                    </div>
                  </div>
                </>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Notice;
