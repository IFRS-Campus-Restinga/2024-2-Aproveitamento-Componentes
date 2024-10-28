import { useEffect, useState } from "react";
import axios from "axios";
import AuthService from "@/services/AuthService";
import { apiClient } from "@/libs/api";

export default async function UserList() {
  return await apiClient.get("/users/list/").then((response) => response.data);
}
