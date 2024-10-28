import { apiClient } from "@/libs/api";

async function UserDetails() {
    return apiClient.get('/user-details').then((response) => response.data);
}

async function UserList() {
    return apiClient.get('/users/list').then((response) => response.data);
}

async function CreateUser(data) {
    return apiClient.post('/users/create/', data)
}

export default {
    UserDetails,
    UserList,
    CreateUser
}