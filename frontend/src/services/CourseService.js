import { apiClient } from "@/libs/api";

const courseList = async () => {
  return await apiClient.get("courses/list").then((response) => response.data);
};

const getCourseById = async (courseId) => {
  return await apiClient
    .get(`courses/read/${courseId}/`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching course by ID:", error);
      throw error;
    });
};


const courseCreate = async (data) => {
  return await apiClient
    .post(`courses/create`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Erro ao criar curso:", error);
      throw error;
    });
};

const courseEdit = async (id, data) => {
  return await apiClient
    .put(`courses/update/${id}/`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Erro ao editar curso:", error);
      throw error;
    });
};

export { courseList, courseCreate, courseEdit, getCourseById  };
