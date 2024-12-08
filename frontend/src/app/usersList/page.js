"use client";
import React, { useState, useEffect } from "react";
import styles from "./usersList.module.css";
import { Button as Btn } from "@/components/Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Filter from "@/components/FilterField/filterField";
import FilterCheckbox from "@/components/FilterCheckbox/filterCheckbox";
import { useUserFilters } from "@/hooks/useUserFilters";
import AuthService from "@/services/AuthService";
import FormProfile from "@/components/Forms/Profile/ProfileForm";
import { handleApiResponse } from "@/libs/apiResponseHandler";
const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move the useUserFilters hook above any conditional returns
  const {
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    selectedVerifieds,
    setSelectedVerifieds,
    selectedCourse,
    setSelectedCourse,
    selectedRole,
    setSelectedRole,
    applyFilters,
  } = useUserFilters(users, setFilteredUsers);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await AuthService.UserList();
        console.log(data);
        handleApiResponse(data);
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.log(err);
        setError(err.message || "An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Adjust the filter arrays based on the loaded data
  const coursesArray = [
    ...new Set(users.map((user) => user.course).filter(Boolean)),
  ].map((course) => ({
    id: course,
    title: course,
  }));

  const rolesArray = [
    ...new Set(users.map((user) => user.type).filter(Boolean)),
  ].map((role) => ({
    id: role,
    title: role,
  }));

  const updateActivity = async (email) => {
    let response = await AuthService.UpdateActivity(email);
    if (response.status !== 201) return;
    const updatedUsers = users.map((user) =>
      user.email === email ? { ...user, user_active: !user.user_active } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    window.location.reload();
  };

  const handleEdit = (user) => setEditingUser(user);

  const saveEdit = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditingUser(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Usuários</h1>
        <div className={styles.filters}>
          <input
            className={styles.nameFilter}
            type="text"
            value={search}
            placeholder="Buscar nome..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Filter
            optionList={coursesArray}
            label="Cursos"
            onChange={(event, value) => setSelectedCourse(value)}
          />
          <Filter
            optionList={rolesArray}
            label="Tipo"
            onChange={(event, value) => setSelectedRole(value)}
          />
          <Filter
            optionList={[
              { id: true, title: 'Ativo' },
              { id: false, title: 'Inativo' },
            ]}
            label="Estado"
            onChange={(event, value) => setSelectedStatus(value)}
          />
          <Filter
            optionList={[
              { id: true, title: 'Sim' },
              { id: false, title: 'Não' },
            ]}
            label="Verificado"
            onChange={(event, value) => setSelectedVerifieds(value)}
          />
          <Btn color="#46b5ff" onClick={applyFilters}>
            Filtrar
          </Btn>
        </div>
        <div className={styles.scrollableTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Curso</th>
                <th>Matrícula</th>
                <th>SIAPE</th>
                <th>Servidor</th>
                <th>Estado</th>
                <th>Verificado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name ?? "N/A"}</td>
                  <td>{user.email ?? "N/A"}</td>
                  <td>{user.type ?? "N/A"}</td>
                  <td>{user.course ?? "N/A"}</td>
                  <td>{user.matricula ?? "N/A"}</td>
                  <td>{user.siape ?? "N/A"}</td>
                  <td>{user.servant_type ?? "N/A"}</td>
                  <td>{user.is_active ? "Ativo" : "Inativo"}</td>
                  <td>{user.is_verified ? <span className="p-icon pi pi-fw pi-check-circle ms-9 text-2xl" style={{ color: "#2f9e41" }}></span>
                    : <span className="p-icon pi pi-fw pi-exclamation-triangle ms-9 text-2xl" style={{ color: "#f1c40f" }}></span>}
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      style={{ marginRight: "10px", cursor: "pointer" }}
                      onClick={() => handleEdit(user)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer" }}
                      onClick={() => updateActivity(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingUser && (
        <div className={styles.modal}>
          <h2>Editar Usuário</h2>
          <FormProfile
            user={editingUser}
            onSave={(updatedUser) => saveEdit(updatedUser)}
            onCancel={() => setEditingUser(null)}
            admEditing={true}
          />
        </div>
      )}
    </div>
  );
};

export default UsersList;
