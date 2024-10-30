import { apiClient } from "@/libs/api";

async function UserDetails() {
    return apiClient.get('users/details').then((response) => response.data);
}

async function UserList() {
    return apiClient.get('/users/list').then((response) => response.data);
}

async function CreateUser(data) {
    return apiClient.post('/users/create/', data)
}

async function AlterActivity(email) {
    return apiClient.get(`/users/alter-activity/${email}`)
}

export default {
    UserDetails,
    UserList,
    CreateUser,
    AlterActivity
}