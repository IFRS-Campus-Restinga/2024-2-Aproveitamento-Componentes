import { apiClient } from "@/libs/api";

export async function PlanoList() {
    return apiClient.get('/courses/plano').then((response) => response.data);
}

async function CreatePlano(data) {
    try {
      const response = await apiClient.post('/courses/plano', data);

      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error('Falha ao criar plano');
      }
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      throw error;
    }
  }

export async function GetPlano(id) {
    try {
      const response = await apiClient.get(`/courses/plano/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar plano com ID ${id}:`, error);
      throw error;
    }
}

async function UpdatePlano(id, data) {
  try {
    const response = await apiClient.put(`/api/disciplines/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar plano com UUID ${id}:`, error);
    throw error;
  }
}

async function DeletePlano(id) {
    return apiClient.delete(`/courses/plano/${id}/`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Erro ao excluir plano:", error);
        throw error;
      });
  }


export default {
    PlanoList,
    CreatePlano,
    UpdatePlano,
    DeletePlano,
    GetPlano
}

