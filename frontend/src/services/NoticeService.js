import { apiClient } from "@/libs/api";

const noticeList = async () => {
  return await apiClient.get("notices/").then((response) => response.data);
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

export { noticeList, noticeCreate, noticeEdit };
