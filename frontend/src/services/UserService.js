import { useEffect, useState } from "react";
import axios from "axios";

export default function GetUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/users/list");
        setUsers(response.data);
      } catch (err) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return users;
}

// import { apiClient } from "@/libs/api";

// async function getUsers() {
//   return apiClient.get("/detalhes-usuario/").then((response) => response.data);
// }

// export default {
//   getUsers,
// };
