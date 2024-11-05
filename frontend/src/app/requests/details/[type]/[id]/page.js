"use client";

import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import { default as Stepper }  from "@/components/Stepper/stepper";
import styles from "./details.module.css";
import {baseURL} from "@/libs/api";

const Details = () => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const segments = pathname.split("/");
        const id = segments.at(-1);
        const type = segments.at(-2);

        console.log(id + "###" + type);

        if (id && type) {
            const fetchDetails = async () => {
                try {
                    const response = await fetch(`${baseURL}/forms/${type}/${id}/`);
                    if (!response.ok) throw new Error("Erro ao buscar detalhes");
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
            setLoading(false);
        }
    }, [pathname]); // Especifica o pathname como dependência

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <h2>Detalhes da Solicitação</h2>
            {details ? (
                <div>
                    <Stepper currentStep={details.status_display}/>
                    <p><strong>Disciplina:</strong> {details.discipline_name}</p>
                    <p><strong>Status:</strong> {details.status_display}</p>
                    <p><strong>Data de Criação:</strong> {new Date(details.create_date).toLocaleDateString("pt-BR")}</p>
                </div>
            ) : (
                <p>Nenhum detalhe encontrado.</p>
            )}
        </div>
    );
};

export default Details;
