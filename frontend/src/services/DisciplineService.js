import { apiClient } from "@/libs/api";

const disciplineList = async () => {
  return await apiClient.get("disciplines/list").then((response) => response.data.disciplines);
};


const getDisciplineById = async (disciplineId) => {
  return await apiClient
    .get(`disciplines/read/${disciplineId}/`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching discipline by ID:", error);
      throw error;
    });
};


export { disciplineList,getDisciplineById };
