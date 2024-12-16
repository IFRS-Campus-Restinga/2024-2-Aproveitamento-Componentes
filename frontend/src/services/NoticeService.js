import { apiClient } from "@/libs/api";

const noticeList = async ({ page = 1, pageSize = 10 }) => {
  const url = `notices/?page=${page}&pageSize=${pageSize}`;
  console.log("Fetching from URL:", url); // Para depuração
  return await apiClient.get(url).then((response) => response.data);
};

const noticeListAll = async () => {
  const url = `notices/`; // Sem parâmetros de paginação
  console.log("Fetching all notices from URL:", url); // Para depuração
  return await apiClient.get(url).then((response) => response.data);
};

const noticeCreate = async (data) => {
  return await apiClient
    .post("notices/", data)
    .then((response) => response.data);
};

const noticeEdit = async (id, data) => {
  return await apiClient
    .put(`notices/${id}/`, data)
    .then((response) => response.data);
};

export { noticeList, noticeCreate, noticeEdit, noticeListAll };
