"use client";
import {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import styles from "./requests.module.css";
import {baseURL} from "@/libs/api";

const Requests = () => {
    const [knowledgeCertifications, setKnowledgeCertifications] = useState([]);
    const [recognitionOfPriorLearning, setRecognitionOfPriorLearning] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchKnowledgeCertifications = async () => {
            try {
                const response = await fetch(`${baseURL}/forms/knowledge-certifications/`);
                if (!response.ok) throw new Error('Erro ao buscar Certificados de Conhecimento');
                const data = await response.json();
                setKnowledgeCertifications(data);
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchRecognitionOfPriorLearning = async () => {
            try {
                const response = await fetch(`${baseURL}/forms/recognition-forms/`);
                if (!response.ok) throw new Error('Erro ao buscar Aproveitamento de Estudos');
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

    const handleDetailsClick = useCallback((item) => {
        if (router) {
            const path = item.type === 'recognition'
                ? `/requests/details/recognition-forms/${item.id}/`
                : `/requests/details/knowledge-certifications/${item.id}/`;
            router.push(path);
        }
    }, [router]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.contentWrapper}>
            <div className={styles.scrollableTable}>
                <h2 className={styles.title}>Certificações de conhecimento</h2>
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
                            <td colSpan="4" style={{textAlign: 'center', color: 'gray'}}>
                                Sem resultados para Certificado de Conhecimento
                            </td>
                        </tr>
                    ) : (
                        knowledgeCertifications.map((certification) => (
                            <tr key={certification.id}>
                                <td>{certification.student_name || "-"}</td>
                                <td>{certification.discipline_name || "-"}</td>
                                <td>{certification.status_display || "-"}</td>
                                <td style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    {new Date(certification.create_date).toLocaleDateString("pt-BR")}
                                    <button onClick={() => handleDetailsClick({...certification, type: 'knowledge'})}
                                            style={{marginLeft: 'auto'}}>
                                        Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <h2 className={styles.title}>Aproveitamento de estudos</h2>
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
                            <td colSpan="4" style={{textAlign: 'center', color: 'gray'}}>
                                Sem resultados para Aproveitamento de Estudos
                            </td>
                        </tr>
                    ) : (
                        recognitionOfPriorLearning.map((learning) => (
                            <tr key={learning.id}>
                                <td>{learning.student_name || "-"}</td>
                                <td>{learning.discipline_name || "N/A"}</td>
                                <td>{learning.status_display || "N/A"}</td>
                                <td style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    {new Date(learning.create_date).toLocaleDateString("pt-BR")}
                                    <button onClick={() => handleDetailsClick({...learning, type: 'recognition'})}
                                            style={{marginLeft: 'auto'}}>
                                        Detalhes
                                    </button>
                                </td>
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
