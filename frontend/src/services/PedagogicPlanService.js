import { apiClient } from "@/libs/api";

const pedagogicPlanList = async () => {
  return await apiClient.get("pedagogical_plans/list").then((response) => response.data);
};

const pedagogicPlanCreate = async (data) => {
  return await apiClient
    .post(`pedagogical_plans/create`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Erro ao criar plano pedagógico:", error);
      throw error;
    });
};

const pedagogicPlanEdit = async (id, data) => {
  return await apiClient
    .put(`pedagogical_plans/update/${id}`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Erro ao editar plano pedagógico:", error);
      throw error;
    });
};

export { pedagogicPlanList, pedagogicPlanCreate, pedagogicPlanEdit  };
