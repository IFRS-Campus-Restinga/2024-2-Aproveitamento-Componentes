import { apiClient } from "@/libs/api";

const courseList = async () => {
  return await apiClient.get("courses/list").then((response) => response.data.courses);
};


const courseCreate = async (data) => {
  return await apiClient
    .post(`courses/create/${id}`, data)
    .then((response) => response.data);
};

const courseEdit = async (id, data) => {
  return await apiClient
    .put(`courses/update/${id}`, data)
    .then((response) => response.data);
};

export { courseList, courseCreate, courseEdit };
