"use client";
import { useEffect, useState } from "react";
import styles from "./modalDiscipline.module.css";
import { Button } from "../../components/Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faEye, faArrowLeft, faSearch} from "@fortawesome/free-solid-svg-icons";
import DisciplineService from "@/services/DisciplineService";

const ModalDisciplineRegistration = ({ onClose, goBack }) => {
  const [disciplineList, setDisciplineList] = useState([]); 
  const [filteredDisciplineList, setFilteredDisciplineList] = useState([]);
  const [newDiscipline, setNewDiscipline] = useState({
    name: "",
    workload: "",
    syllabus: "",
    prerequisites: [],
    professors: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [editingDiscipline, setEditingDiscipline] = useState(null);
  const [showDetails, setShowDetails] = useState(false); // Controle de exibição dos detalhes

  const DeleteDiscipline = async (uuid) => {
    try {
      const response = await DisciplineService.DeleteDiscipline(uuid);
      alert("Disciplina excluída com sucesso!");
  
      // Após a exclusão, recarregar a lista
      const updatedData = await DisciplineService.DisciplineList();
      const sortedData = updatedData.sort((a, b) => a.name.localeCompare(b.name));
  
      setDisciplineList(sortedData);
      setFilteredDisciplineList(sortedData);  // Atualizar a listagem filtrada
  
      setShowDetails(false);  // Fechar detalhes após exclusão
    } catch (err) {
      console.error("Erro ao excluir disciplina:", err);
      alert("Erro ao excluir disciplina.");
    }
  };

  const saveDiscipline = async () => {
    if (!newDiscipline.name || !newDiscipline.workload || !newDiscipline.syllabus || !newDiscipline.professors) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      if (editingDiscipline) {
        // Atualiza disciplina existente
        await DisciplineService.UpdateDiscipline(editingDiscipline.id, newDiscipline);
        alert("Disciplina atualizada com sucesso!");
        setDisciplineList((prevList) =>
          prevList.map((d) => (d.id === editingDiscipline.id ? { ...d, ...newDiscipline } : d))
        );
      } else {
        // Cria nova disciplina
        const createdDiscipline = await DisciplineService.CreateDiscipline(newDiscipline);
        alert("Disciplina cadastrada com sucesso!");
        setDisciplineList((prevList) => [...prevList, createdDiscipline]);
      }
  
      // Recarregar a lista de disciplinas após criação ou atualização
      const updatedData = await DisciplineService.DisciplineList();
      const sortedData = updatedData.sort((a, b) => a.name.localeCompare(b.name));
      setDisciplineList(sortedData);
      setFilteredDisciplineList(sortedData);  // Atualizar a listagem filtrada
  
      setNewDiscipline({
        name: "",
        workload: "",
        syllabus: "",
        prerequisites: [],
        professors: "",
      });
      setEditingDiscipline(null);
      setIsFormVisible(false);
      setShowDetails(false);  // Fechar detalhes após salvar
    } catch (err) {
      console.error("Erro ao salvar disciplina:", err);
    }
  };

  useEffect(() => {
    const fetchDisciplineList = async () => {
      try {
        const data = await DisciplineService.DisciplineList();
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); 
        setDisciplineList(sortedData);
        setFilteredDisciplineList(sortedData); 
      } catch (err) {
        console.error("Erro ao carregar disciplinas:", err);
      }
    };
    fetchDisciplineList();
  }, []);

  const showDisciplineDetails = (discipline) => {
    setSelectedDiscipline(discipline);
    if (showDetails === discipline.id) {
      setShowDetails(false); // Se os detalhes já estiverem abertos, fecha
    } else {
      setShowDetails(discipline.id); // Caso contrário, abre os detalhes da disciplina selecionada
    }
  };

  const editDiscipline = (discipline) => {
    setNewDiscipline({
      name: discipline.name,
      workload: discipline.workload,
      syllabus: discipline.syllabus,
      prerequisites: discipline.prerequisites,
      professors: discipline.professors,
    });
    setEditingDiscipline(discipline);
    setIsFormVisible(true);
    setShowDetails(false); // Fechar detalhes ao editar
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredList = disciplineList.filter(
      (discipline) =>
        discipline.name.toLowerCase().includes(query.toLowerCase()) ||
        discipline.professors.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDisciplineList(filteredList);
  };

  const handleGoBack = () => {
    console.log("Botão Voltar clicado");
    window.history.back(); // Função para voltar à página anterior
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <div className={styles.topSection}>
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
          <Button type="button" onClick={() => setIsFormVisible(true)} className={styles.registerButton}>
            Cadastrar
          </Button>
          <Button type="button" onClick={handleGoBack} className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} /> Sair
          </Button>
        </div>

        {!isFormVisible ? (
          <div className={styles.tableSection}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Disciplinas cadastradas</th>
                  <th>Professor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDisciplineList.map((discipline, index) => (
                  <tr key={index}>
                    <td>{discipline.name ?? "N/A"}</td>
                    <td>{discipline.professors ?? "N/A"}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() => showDisciplineDetails(discipline)}
                      />
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                        onClick={() => editDiscipline(discipline)}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ cursor: "pointer" }}
                        onClick={() => DeleteDiscipline(discipline.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.formSection}>
            <h3>{editingDiscipline ? "Editar Disciplina" : "Cadastro de Disciplina"}</h3>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Nome da Disciplina</label>
              <input
                type="text"
                value={newDiscipline.name}
                onChange={(e) => setNewDiscipline({ ...newDiscipline, name: e.target.value })}
                placeholder="Nome da disciplina"
                className={styles.disciplineInput}
              />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Carga Horária</label>
              <input
                type="text"
                value={newDiscipline.workload}
                onChange={(e) => setNewDiscipline({ ...newDiscipline, workload: e.target.value })}
                placeholder="Carga horária"
                className={styles.disciplineInput}
              />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Ementa</label>
              <textarea
                value={newDiscipline.syllabus}
                onChange={(e) => setNewDiscipline({ ...newDiscipline, syllabus: e.target.value })}
                placeholder="Ementa da disciplina"
                className={styles.disciplineInput}
              />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Professores</label>
              <input
                type="text"
                value={newDiscipline.professors}
                onChange={(e) => setNewDiscipline({ ...newDiscipline, professors: e.target.value })}
                placeholder="Professores responsáveis"
                className={styles.disciplineInput}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button type="button" onClick={saveDiscipline}>
                Confirmar
              </Button>
              <Button type="button" color="#af0a0a" onClick={() => setIsFormVisible(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {selectedDiscipline && showDetails && (
          <div className={styles.detailModal}>
            <h3>Detalhes da Disciplina</h3>
            <p><strong>Nome:</strong> {selectedDiscipline.name}</p>
            <p><strong>Carga Horária:</strong> {selectedDiscipline.workload}</p>
            <p><strong>Ementa:</strong> {selectedDiscipline.syllabus}</p>
            <p><strong>Professores:</strong> {selectedDiscipline.professors}</p>
            <Button type="button" onClick={() => setSelectedDiscipline(null)}>
              Fechar
            </Button>
          </div>
        )}

        <div className={styles.bottomSection}>
        </div>
      </div>
    </div>
  );
};

export default ModalDisciplineRegistration;