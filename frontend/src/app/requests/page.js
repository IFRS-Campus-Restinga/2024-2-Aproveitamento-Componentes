"use client";
import { useEffect, useState } from "react";
import styles from "./requests.module.css";
import { baseURL } from "@/libs/api";

const Requests = () => {
    const [knowledgeCertifications, setKnowledgeCertifications] = useState([]);
    const [recognitionOfPriorLearning, setRecognitionOfPriorLearning] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKnowledgeCertifications = async () => {
            try {
                const response = await fetch(`${baseURL}/forms/knowledge-certifications/`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar Certificados de Conhecimento');
                }
                const data = await response.json();
                setKnowledgeCertifications(data);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchRecognitionOfPriorLearning = async () => {
            try {
                const response = await fetch(`${baseURL}/forms/recognition-forms/`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar Aproveitamento de Estudos');
                }
                const data = await response.json();
                setRecognitionOfPriorLearning(data);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchData = async () => {
            await Promise.all([fetchKnowledgeCertifications(), fetchRecognitionOfPriorLearning()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.contentWrapper}>
            <div className={styles.scrollableTable}>
                <h2>Certificações de conhecimento</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Estudante</th>
                            <th>Disciplina</th>
                            <th>Status</th>
                            <th>Data de Criação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {knowledgeCertifications.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: 'gray' }}>
                                    Sem resultados para Certificado de Conhecimento
                                </td>
                            </tr>
                        ) : (
                            knowledgeCertifications.map((certification) => (
                                <tr key={certification.id}>
                                    <td>-</td> {/* Estudante ausente */}
                                    <td>{certification.discipline_name || "N/A"}</td>
                                    <td>{certification.status || "N/A"}</td> {/* Status por extenso */}
                                    <td>{new Date(certification.create_date).toLocaleDateString("pt-BR")}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <h2>Aproveitamento de estudos</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Estudante</th>
                            <th>Disciplina</th>
                            <th>Status</th>
                            <th>Data de Criação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recognitionOfPriorLearning.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', color: 'gray' }}>
                                    Sem resultados para Aproveitamento de Estudos
                                </td>
                            </tr>
                        ) : (
                            recognitionOfPriorLearning.map((learning) => (
                                <tr key={learning.id}>
                                    <td>-</td> {/* Estudante ausente */}
                                    <td>{learning.discipline_name || "N/A"}</td>
                                    <td>{learning.status || "N/A"}</td> {/* Status por extenso */}
                                    <td>{new Date(learning.create_date).toLocaleDateString("pt-BR")}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Requests;
