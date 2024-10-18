"use client";
import React, { useState } from "react";
import styles from "./usersList.module.css";
import { Button as Btn } from "@/components/Button/button";
import {
  users as initialUsers,
  courses,
  admissions,
  roles,
} from "@/mocks/dataMocks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Filter from "@/components/FilterField/filterField";
import FilterCheckbox from "@/components/FilterCheckbox/filterCheckbox";
import { useUserFilters } from "@/hooks/useUserFilters";

const UsersList = () => {
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [editingUser, setEditingUser] = useState(null);

  const {
    search,
    setSearch,
    showActive,
    setShowActive,
    showInactive,
    setShowInactive,
    selectedCourse,
    setSelectedCourse,
    selectedAdmission,
    setSelectedAdmission,
    selectedRole,
    setSelectedRole,
    applyFilters,
  } = useUserFilters(users, setFilteredUsers);

  const deleteUser = (email) => {
    const updatedUsers = users.filter((user) => user.Email !== email);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const handleEdit = (user) => setEditingUser(user);

  const saveEdit = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.Id === updatedUser.Id ? updatedUser : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditingUser(null);
  };

  const coursesArray = Object.entries(courses).map(([key, value]) => ({
    id: key,
    title: value,
  }));
  const admissionsArray = Object.entries(admissions).map(([key, value]) => ({
    id: key,
    title: value,
  }));
  const rolesArray = Object.entries(roles).map(([key, value]) => ({
    id: key,
    title: value,
  }));

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
            label="Cargo"
            onChange={(event, value) => setSelectedRole(value)}
          />
          <Filter
            optionList={admissionsArray}
            label="Ingresso"
            onChange={(event, value) => setSelectedAdmission(value)}
          />
          <FilterCheckbox
            label={"Ativo"}
            checked={showActive}
            onChange={() => setShowActive(!showActive)}
          />
          <FilterCheckbox
            label={"Inativo"}
            checked={showInactive}
            onChange={() => setShowInactive(!showInactive)}
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
                <th>Curso</th>
                <th>Matrícula</th>
                <th>CIAPE</th>
                <th>Ingresso</th>
                <th>Cargo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.Name ?? "N/A"}</td>
                  <td>{user.Email ?? "N/A"}</td>
                  <td>{user.Course ?? "N/A"}</td>
                  <td>{user.Enrollment ?? "N/A"}</td>
                  <td>{user.Ciape ?? "N/A"}</td>
                  <td>{user.Admission ?? "N/A"}</td>
                  <td>{user.Role ?? "N/A"}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      style={{ marginRight: "10px", cursor: "pointer" }}
                      onClick={() => handleEdit(user)}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteUser(user.Email)}
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
          <input
            className={styles.nameFilter}
            type="text"
            value={editingUser.Name}
            onChange={(e) =>
              setEditingUser({ ...editingUser, Name: e.target.value })
            }
          />
          <div className={styles.modalBtn}>
            <Btn color="#46b5ff" onClick={() => saveEdit(editingUser)}>
              Salvar
            </Btn>
            <Btn type={"cancel"} onClick={() => setEditingUser(null)}>
              Cancelar
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;