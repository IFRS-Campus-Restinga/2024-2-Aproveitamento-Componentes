"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import styles from "./requests.module.css";
import RequestService from "@/services/RequestService";
import { checkIfNoticeIsOpen } from "@/services/RequestService";
import {useAuth} from "@/context/AuthContext";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {filterStatus, getFailed, getPending, getStatusStepIndex, getSucceeded, steps} from "@/app/requests/status"
import Toast from "@/utils/toast";

const Requests = () => {
    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});
    const [mergedRequests, setMergedRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedStep, setSelectedStep] = useState(-1);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useAuth();
    const router = useRouter();

    const closeToast = () => {
        setToast(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kcResponse, rplResponse] = await Promise.all([
                    RequestService.GetKnowledgeCertifications(),
                    RequestService.GetRecognitionOfPriorLearning(),
                ]);

                const knowledgeCertifications = kcResponse.data.results.map((item) => ({
                    ...item,
                    type: "knowledge",
                }));
                const recognitionOfPriorLearning = rplResponse.data.results.map((item) => ({
                    ...item,
                    type: "recognition",
                }));

                const merged = [...knowledgeCertifications, ...recognitionOfPriorLearning];

                merged.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));
                console.log(merged)
                setMergedRequests(merged);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();

        // Verificar o tipo de usuário
        if (user.user.type === "Estudante") {
            setSearchQuery(user.user.name);
            setIsReadOnly(true);
        }
    }, []);

    const handleDetailsClick = (item) => {
        if (router) {
            const path =
                item.type === "recognition"
                    ? `/requests/details/recognition-forms/${item.id}/`
                    : `/requests/details/knowledge-certifications/${item.id}/`;
            router.push(path);
        }
    };

    const filteredRequests = mergedRequests.filter((item) => {
        const matchesSearch = item.student_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStep = selectedStep === -1 || getStatusStepIndex(item.status_display) === selectedStep;
        const matchesStatus = selectedStatus === '' ||
            (selectedStatus === "Sucesso" && getSucceeded().includes(item.status_display)) ||
            (selectedStatus === "Pendente" && getPending().includes(item.status_display)) ||
            (selectedStatus === "Falha" && getFailed().includes(item.status_display));
        return matchesSearch && matchesStep && matchesStatus;
    });

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    const handleRequestFormRedirect = async () => {
        const isNoticeOpen = await checkIfNoticeIsOpen(); // Verifica se o edital está aberto
    
        if (isNoticeOpen) {
            // Se o edital estiver aberto, redireciona para o formulário
            window.location.href = "/requests/requestForm";
        } else {
            // Caso contrário, exibe uma mensagem informando que o edital está fechado
            // alert("Não há edital aberto no momento, aguarde.");
            setToast(true);
            setToastMessage({
              type: "info",
              text: "Não há edital aberto no momento, aguarde.",
            });
        }
    };

    return (
        <div className={styles.contentWrapper}>
            <div className={styles.topSection}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Buscar por nome do estudante..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                        readOnly={isReadOnly}
                    />
                </div>
                <div className={styles.filterContainer}>
                    <select
                        value={selectedStep}
                        onChange={(e) => setSelectedStep(Number(e.target.value))}
                        className={styles.filterSelect}
                    >
                        <option value="-1">Todas as Etapas</option>
                        {steps.map((step) => (
                            <option key={step.label} value={step.index}>
                                {step.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.filterContainer}>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="">Todos os Status</option>
                        {filterStatus.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.tableSection}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Estudante</th>
                        <th>Tipo</th>
                        <th>Disciplina</th>
                        <th>Data de Criação</th>
                        <th>Responsável</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRequests.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{textAlign: "center", color: "gray"}}>
                                Sem resultados
                            </td>
                        </tr>
                    ) : (
                        filteredRequests.map((item) => (
                            <tr key={item.id}>
                                <td>{item.student_name || "-"}</td>
                                <td>
                                    {item.type === "knowledge"
                                        ? "Certificação de Conhecimento"
                                        : "Aproveitamento de Estudos"}
                                </td>
                                <td>{item.discipline_name || "-"}</td>
                                <td>{new Date(item.create_date).toLocaleDateString("pt-BR")}</td>
                                <td>{Array.from(item.steps).pop()?.responsible?.name || "-"}</td>
                                <td>{item.status_display || "-"}</td>
                                <td>
                                    <button className={styles.button} onClick={() => handleDetailsClick(item)}>
                                        Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
            <div>
                <button onClick={handleRequestFormRedirect} className={styles.addButton}>
                    <FontAwesomeIcon icon={faPlus} size="2x"/>
                </button>
            </div>
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

export default Requests;
