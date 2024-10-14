import { apiClient } from "@/libs/api";

async function detalhesUsuario() {
    return apiClient.get('/consultas/detalhes-usuario/').then((response) => response.data);
}

export default {
    detalhesUsuario
}