"use client";
import { useState } from "react";
import styles from "./requests.module.css";
import { requests as initialRequests } from "@/mocks/dataMocks";

const Requests = () => {
  const [requests, setRequests] = useState(initialRequests);

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.scrollableTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Curso</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {initialRequests.map((requests, index) => (
              <tr key={index}>
                <td>{requests.Course ?? "N/A"}</td>
                <td>{requests.Name ?? "N/A"}</td>
                <td>{requests.Type ?? "N/A"}</td>
                <td>{requests.Status ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Requests;
