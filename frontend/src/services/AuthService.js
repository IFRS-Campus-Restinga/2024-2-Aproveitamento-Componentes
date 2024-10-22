import { apiClient } from "@/libs/api";

async function detalhesUsuario() {
    return apiClient.get('/detalhes-usuario/').then((response) => response.data);
}

async function userList() {
    return apiClient.get('/users/list/').then((response) => response.data);
}

export default {
    detalhesUsuario,
    userList
}