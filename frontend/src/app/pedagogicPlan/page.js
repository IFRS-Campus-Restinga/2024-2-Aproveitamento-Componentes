"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./pedagogicPlan.module.css";
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
import { pedagogicPlanList } from "@/services/PedagogicPlanService";

const ITEMS_PER_PAGE = 10; // Quantidade de itens por página

const PedagogicPlan = () => {
  const { user } = useAuth();
  const [pedagogicPlans, setPedagogicPlans] = useState([]);
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

  useEffect(() => {
    const fetchPedagogicPlans = async () => {
      try {
        const data = await pedagogicPlanList();
        setPedagogicPlans(data);
        console.log("PedagogicPlans ",data);
      } catch (err) {
        console.log(err);
        setToast(true);
        setToastMessage({
          type: "error",
          text: "Não fui possivel buscar os editais",
        });
      }
    };
    fetchPedagogicPlans();
  }, []);

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
        setAllNotices(data.results);
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

  // Handle filtro
//   const applyFilters = () => {
//     if (filter) {
//       return pedagogicPlans.filter(
//         (notice) =>
//           notice.start_duration?.toLowerCase().includes(filter.toLowerCase()) ||
//           notice.courses.includes(filter) ||
//           notice.disciplines?.toLowerCase().includes(filter.toLowerCase())
//       );
//     }
//     return pedagogicPlans;
//   };

//   const filteredNotices = applyFilters();

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

  useEffect(() => {
    console.log(pedagogicPlans)
  }, [pedagogicPlans]);

  return (
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
            {pedagogicPlans.map((notice) => (
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
  );
};

export default PedagogicPlan;
