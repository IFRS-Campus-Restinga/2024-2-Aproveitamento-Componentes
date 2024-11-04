"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use o useRouter da biblioteca next/navigation
import { baseURL } from "@/libs/api";

const Details = () => {
    const router = useRouter();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Verifica se o router está pronto
        if (!router.isReady) return; // Se o router não estiver pronto, não faça nada

        const { type, id } = router.query; // Obtém os parâmetros da rota

        // Verifica se type e id estão definidos
        if (type && id) {
            const fetchDetails = async () => {
                try {
                    const response = await fetch(`${baseURL}/forms/${type}/${id}/`);
                    if (!response.ok) throw new Error('Erro ao buscar detalhes');
                    const data = await response.json();
                    setDetails(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchDetails();
        } else {
            setLoading(false); // Se não houver type ou id, define loading como false
        }
    }, [router]); // Observe o router

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Detalhes da Solicitação</h2>
            {details ? (
                <div>
                    <p><strong>Disciplina:</strong> {details.discipline_name}</p>
                    <p><strong>Status:</strong> {details.status}</p>
                    <p><strong>Data de Criação:</strong> {new Date(details.create_date).toLocaleDateString("pt-BR")}</p>
                </div>
            ) : (
                <p>Nenhum detalhe encontrado.</p>
            )}
        </div>
    );
};

export default Details;
