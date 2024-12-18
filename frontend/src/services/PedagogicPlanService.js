import { apiClient } from "@/libs/api";

// Lista todos os planos pedagógicos com paginação
const pedagogicalPlanCourseList = async ({ page = 1, pageSize = 10 }) => {
  const url = `pedagogical-plan-courses/?page=${page}&pageSize=${pageSize}`;
  console.log("Fetching from URL:", url); // Para depuração
  return await apiClient.get(url).then((response) => response.data);
};

// Lista todos os planos pedagógicos (sem paginação)
const pedagogicalPlanCourseListAll = async () => {
  const url = `pedagogical-plans/pedagogical-plans/`;
  console.log("Fetching all plans from URL:", url); // Para depuração
  const data = await apiClient.get(url).then((response) => response.data);
  console.log("Planos Service:", data);
  return data;
};

// Cria um novo plano pedagógico
const pedagogicalPlanCourseCreate = async (data) => {
  return await apiClient
    .post("pedagogical-plan-courses/", data)
    .then((response) => response.data);
};

// Edita um plano pedagógico existente
const pedagogicalPlanCourseEdit = async (id, data) => {
  return await apiClient
    .put(`pedagogical-plan-courses/${id}/`, data)
    .then((response) => response.data);
};

// Deleta um plano pedagógico existente
const pedagogicalPlanCourseDelete = async (id) => {
  return await apiClient
    .delete(`pedagogical-plan-courses/${id}/`)
    .then((response) => response.status === 204);
};

export {
  pedagogicalPlanCourseList,
  pedagogicalPlanCourseListAll,
  pedagogicalPlanCourseCreate,
  pedagogicalPlanCourseEdit,
  pedagogicalPlanCourseDelete,
};
