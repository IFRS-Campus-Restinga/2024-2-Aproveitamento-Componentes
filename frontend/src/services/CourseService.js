import { apiClient } from "@/libs/api";

const courseList = async () => {
  return await apiClient.get("courses/").then((response) => response.data);
};

const courseCreate = async (data) => {
  return await apiClient
    .post("courses/", data)
    .then((response) => response.data);
};

const courseEdit = async (id, data) => {
  return await apiClient
    .put(`courses/${id}/`, data)
    .then((response) => response.data);
};

export { courseList, courseCreate, courseEdit };
