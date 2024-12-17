"use client";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";
import styles from "./plano.module.css";
import {Button} from "../../components/Button/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faTrash, faEye, faSearch, faPlus} from "@fortawesome/free-solid-svg-icons";
import PlanoService from "@/services/PlanoService";
import Toast from "@/utils/toast";
import {DisciplineList} from "@/services/DisciplineService";
import {courseList} from "@/services/CourseService";

const PlanoRegistration = ({onClose, goBack}) => {
    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({});
    const [planoList, setPlanoList] = useState([]);
    const [filteredPlanoList, setFilteredPlanoList] = useState([]);
    const [newPlano, setNewPlano] = useState({
        nome: "",
        autorizacao: "",
        ano: "",
        inicio_vigencia: "",
        fim_vigencia: "",
        carga_horaria: "",
        duracao: "",
        turno: "",
        courso: "",
        disciplina: "",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedPlano, setSelectedPlano] = useState(null);
    const [editingPlano, setEditingPlano] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [availableDisciplines, setAvailableDisciplines] = useState(false);
    const [availableCourses, setAvailableCourses] = useState(false);

    const closeToast = () => {
        setToast(false);
    };

    useEffect(() => {
        const fetchAvailableDisciplines = async () => {
            try {
                const disciplines = await DisciplineList();
                setAvailableDisciplines(disciplines);
            } catch (error) {
                console.error("Erro ao buscar disciplinas disponíveis:", error);
            }
        };
        const fetchAvailableCourses = async () => {
            try {
                const courses = await courseList();
                console.log(courses)
                setAvailableCourses(courses);
            } catch (error) {
                console.error("Erro ao buscar cursos disponíveis:", error);
            }
        };
        fetchAvailableCourses();
        fetchAvailableDisciplines();
    }, []);

    const DeletePlano = async (id) => {
        try {
            console.log(id)
            const response = await PlanoService.DeletePlano(id);
            setToast(true);
            setToastMessage({
                type: "success",
                text: "Plano excluído com sucesso!",
            });

            // Após a exclusão, recarregar a lista
            const updatedData = await PlanoService.PlanoList();
            // const sortedData = updatedData.sort((a, b) => a.name.localeCompare(b.name));

            setPlanoList(updatedData);
            setFilteredPlanoList(updatedData);  // Atualizar a listagem filtrada

            setShowDetails(false);  // Fechar detalhes após exclusão
        } catch (err) {
            console.error("Erro ao excluir plano:", err);
            setToast(true);
            setToastMessage({
                type: "error",
                text: "Erro ao excluir plano.",
            });
        }
    };

    const savePlano = async () => {
        if (!newPlano.nome || !newPlano.autorizacao || !newPlano.ano || !newPlano.inicio_vigencia ||
            !newPlano.fim_vigencia || !newPlano.carga_horaria || !newPlano.duracao || !newPlano.turno ||
            !newPlano.courso || !newPlano.disciplina) {
            setToast(true);
            setToastMessage({
                type: "warning",
                text: "Por favor, preencha todos os campos obrigatórios.",
            });
            return;
        }
        try {
            if (editingPlano) {
                // Atualiza disciplina existente
                await PlanoService.UpdatePlano(editingPlano.id, newPlano);
                setToast(true);
                setToastMessage({
                    type: "success",
                    text: "Plano atualizado com sucesso!",
                });
                setPlanoList((prevList) =>
                    prevList.map((d) => (d.id === editingPlano.id ? {...d, ...newPlano} : d))
                );
            } else {
                const createdPlano = await PlanoService.CreatePlano(newPlano);
                setToast(true);
                setToastMessage({
                    type: "success",
                    text: "Por favor, preencha todos os campos obrigatórios.",
                });
                setPlanoList((prevList) => [...prevList, createdPlano]);
            }

            // Recarregar a lista de disciplinas após criação ou atualização
            const updatedData = await PlanoService.PlanoList();
            // const sortedData = updatedData.sort((a, b) => a.name.localeCompare(b.name));
            setPlanoList(updatedData);
            setFilteredPlanoList(updatedData);  // Atualizar a listagem filtrada

            setNewPlano({
                nome: "",
                autorizacao: "",
                ano: "",
                inicio_vigencia: "",
                fim_vigencia: "",
                carga_horaria: "",
                duracao: "",
                turno: "",
                courso: "",
                disciplina: "",
            });
            setEditingPlano(null);
            setIsFormVisible(false);
            setShowDetails(false);  // Fechar detalhes após salvar
        } catch (err) {
            console.error("Erro ao salvar plano:", err);
        }
    };

    useEffect(() => {
        const fetchPlanoList = async () => {
            try {
                const data = await PlanoService.PlanoList();
                // const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
                setPlanoList(data);
                setFilteredPlanoList(data);
            } catch (err) {
                console.error("Erro ao carregar planos:", err);
            }
        };
        fetchPlanoList();
    }, []);

    const showPlanoDetails = (plano) => {
        setSelectedPlano(plano);
        console.log(plano)
        if (showDetails === plano.id) {
            setShowDetails(false);
        } else {
            setShowDetails(plano.id);
        }
    };

    const editPlano = (plano) => {
        setNewPlano({
            nome: plano.nome,
            autorizacao: plano.autorizacao,
            ano: plano.ano,
            inicio_vigencia: plano.inicio_vigencia,
            fim_vigencia: plano.fim_vigencia,
            carga_horaria: plano.carga_horaria,
            duracao: plano.duracao,
            turno: plano.turno,
            courso: plano.courso,
            disciplina: plano.disciplina,
        });
        setEditingPlano(plano);
        setIsFormVisible(true);
        setShowDetails(false); // Fechar detalhes ao editar
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filteredList = planoList.filter(
            (plano) =>
                plano.nome.toLowerCase().includes(query.toLowerCase()) ||
                plano.inicio_vigencia.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPlanoList(filteredList);
    };

    const handleGoBack = () => {
        console.log("Botão Voltar clicado");
        window.history.back(); // Função para voltar à página anterior
    };

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContainer}>
                <h1 className={styles.pageTitle}>Planos Pedagógicos</h1>
                <div className={styles.topSection}>
                    <div className={styles.searchContainer}>
                        <div className={styles.searchWrapper}>
                            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon}/>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>
                </div>

                {!isFormVisible ? (
                    <div className={styles.tableSection}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>Planos Cadastrados</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPlanoList.map((plano, index) => (
                                <tr key={index}>
                                    <td>{plano.nome ?? "N/A"}</td>
                                    <td>
                                        <FontAwesomeIcon
                                            icon={faEye}
                                            style={{cursor: "pointer", marginRight: "10px"}}
                                            onClick={() => showPlanoDetails(plano)}
                                        />
                                        <FontAwesomeIcon
                                            icon={faPenToSquare}
                                            style={{cursor: "pointer", marginRight: "10px"}}
                                            onClick={() => editPlano(plano)}
                                        />
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            style={{cursor: "pointer"}}
                                            onClick={() => DeletePlano(plano.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.formSection}>
                        <h3>{editingPlano ? "Editar Plano" : "Cadastro de Plano"}</h3>
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel}>Nome do Plano</label>
                            <input
                                type="text"
                                value={newPlano.nome}
                                onChange={(e) => setNewPlano({...newPlano, nome: e.target.value})}
                                placeholder="Nome do Plano"
                                className={styles.planoInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel}>Autorização</label>
                            <input
                                type="text"
                                value={newPlano.autorizacao}
                                onChange={(e) => setNewPlano({...newPlano, autorizacao: e.target.value})}
                                placeholder="Autorização"
                                className={styles.planoInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel}>Ano</label>
                            <input
                                type="number"
                                value={newPlano.ano}
                                onChange={(e) => setNewPlano({...newPlano, ano: e.target.value})}
                                placeholder="Ano"
                                className={styles.planoInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel}>Inicio da Vigência</label>
                            <input
                                type="date"
                                value={newPlano.inicio_vigencia}
                                onChange={(e) => setNewPlano({...newPlano, inicio_vigencia: e.target.value})}
                                placeholder="Inicio da Vigência"
                                className={styles.planoInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel}>Fim da Vigência</label>
                            <input
                                type="date"
                                value={newPlano.fim_vigencia}
                                onChange={(e) => setNewPlano({...newPlano, fim_vigencia: e.target.value})}
                                placeholder="Fim da Vigência"
                                className={styles.planoInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel}>Carga Horária Total</label>
                            <input
                                type="number"
                                value={newPlano.carga_horaria}
                                onChange={(e) => setNewPlano({...newPlano, carga_horaria: e.target.value})}
                                placeholder="Carga Horária Total"
                                className={styles.planoInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel}>Duração</label>
                            <input
                                type="number"
                                value={newPlano.duracao}
                                onChange={(e) => setNewPlano({...newPlano, duracao: e.target.value})}
                                placeholder="Duração"
                                className={styles.planoInput}
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel}>Turno</label>
                            <input
                                type="text"
                                value={newPlano.turno}
                                onChange={(e) => setNewPlano({...newPlano, turno: e.target.value})}
                                placeholder="Turno"
                                className={styles.planoInput}
                            />
                        </div>
                        {/*<div className={styles.inputContainer}>*/}
                        {/*    <label className={styles.inputLabel}>Curso</label>*/}
                        {/*    <select onChange={(e) => setNewPlano({...newPlano, courso: e.target.value})}>*/}
                        {/*        <option value="">--Selecione--</option>*/}
                        {/*        {availableCourses.map((curso) => (*/}
                        {/*            <option key={curso.id} value={curso.id}>*/}
                        {/*                {curso.name}*/}
                        {/*            </option>*/}
                        {/*        ))}*/}
                        {/*    </select>*/}
                        {/*</div>*/}
                        <div className={styles.inputContainer}>
                            <label className={styles.inputLabel}>Disciplina</label>
                            <select onChange={(e) => setNewPlano({...newPlano, disciplina: e.target.value})}>
                                <option value="">--Selecione--</option>
                                {availableDisciplines.map((discipline) => (
                                    <option key={discipline.id} value={discipline.id}>
                                        {discipline.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Button type="button" onClick={savePlano}>
                                Confirmar
                            </Button>
                            <Button type="button" color="#af0a0a" onClick={() => setIsFormVisible(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}

                {selectedPlano && showDetails && (
                    <div className={styles.detailModal}>
                        <h3>Detalhes do Plano</h3>
                        <p><strong>Nome:</strong> {selectedPlano.nome}</p>
                        <p><strong>Autorização:</strong> {selectedPlano.autorizacao}</p>
                        <p><strong>Ano:</strong> {selectedPlano.ano}</p>
                        <p><strong>Início da Vigência:</strong> {selectedPlano.inicio_vigencia}</p>
                        <p><strong>Fim da Vigência:</strong> {selectedPlano.fim_vigencia}</p>
                        <p><strong>Carga horária total:</strong> {selectedPlano.carga_horaria}</p>
                        <p><strong>Duração:</strong> {selectedPlano.duracao}</p>
                        <p><strong>Turno:</strong> {selectedPlano.turno}</p>
                        <p><strong>Curso:</strong> {selectedPlano.courso}</p>
                        <p><strong>Disciplina:</strong> {selectedPlano.disciplina}</p>
                        <Button type="button" onClick={() => setSelectedPlano(null)}>
                            Fechar
                        </Button>
                    </div>
                )}

                <div className={styles.bottomSection}>
                    <button onClick={() => setIsFormVisible(true)} className={styles.registerButton}>
                        <FontAwesomeIcon icon={faPlus} size="2x"/>
                    </button>
                </div>
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

export default PlanoRegistration;