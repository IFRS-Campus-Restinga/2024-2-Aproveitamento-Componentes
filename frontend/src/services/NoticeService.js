import { apiClient } from "@/libs/api";

const noticeList = async () => {
  return await apiClient.get("notices/").then((response) => response.data);
};

const noticeCreate = async () => {};

const noticeEdit = async () => {};

export { noticeList, noticeCreate, noticeEdit };
