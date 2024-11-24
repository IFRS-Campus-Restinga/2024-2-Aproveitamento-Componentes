import { apiClient } from "@/libs/api";

async function DisciplineList() {
    return apiClient.get('/api/disciplines/').then((response) => response.data);
}

// Função para criar uma nova disciplina
async function CreateDiscipline(data) {
    try {
      // Envia a requisição POST para criar a disciplina
      const response = await apiClient.post('/api/disciplines/', data);
  
      // Verifica se a resposta foi bem-sucedida
      if (response.status === 201) {
        return response.data; // Retorna os dados da disciplina criada
      } else {
        throw new Error('Falha ao criar disciplina'); // Lança erro se status não for 201
      }
    } catch (error) {
      console.error('Erro ao criar disciplina:', error);
      throw error; // Repassa o erro para quem chamou
    }
  }

// Função para obter uma disciplina específica pelo ID
async function GetDiscipline(id) {
    try {
      const response = await apiClient.get(`/api/disciplines/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar disciplina com ID ${id}:`, error);
      throw error;
    }
}

// Função para atualizar uma disciplina existente pelo ID
async function UpdateDiscipline(uuid, data) {
  try {
    const response = await apiClient.put(`/api/disciplines/${uuid}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar disciplina com UUID ${uuid}:`, error);
    throw error;
  }
}

// Função para deletar uma disciplina pelo ID
async function DeleteDiscipline(uuid) {
    return apiClient.delete(`/api/disciplines/${uuid}/`)  // Usando uuid no caminho
      .then((response) => response.data)
      .catch((error) => {
        console.error("Erro ao excluir disciplina:", error);
        throw error;
      });
  }


export default {
    DisciplineList,
    CreateDiscipline,
    GetDiscipline,
    UpdateDiscipline,
    DeleteDiscipline
}

