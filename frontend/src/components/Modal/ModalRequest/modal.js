import React, { useState, useEffect } from "react";
import { getFailed, getSucceeded } from "@/app/requests/status";
import styles from './modalRequest.module.css';

const Modal = ({ status, onClose, onConfirm, isOpen }) => {
    const [feedback, setFeedback] = useState("");
    const [isFeedbackValid, setIsFeedbackValid] = useState(true);
    const isSucceeded = getSucceeded().includes(status);
    const isFailed = getFailed().includes(status);

    const getButtonColor = () => {
        if (isSucceeded) return styles.green;
        if (isFailed) return styles.red;
        return styles.yellow;
    };

    const getMessage = () => {
        if (isSucceeded) return "a aprovação";
        if (isFailed) return "a rejeição";
        return "o retorno";
    };

    const handleConfirm = () => {
        if (feedback.trim() === "") {
            setIsFeedbackValid(false);
            return;
        }
        onConfirm(feedback);
    };

    useEffect(() => {
        if (!isOpen) {
            setFeedback("");
            setIsFeedbackValid(true);
        }
    }, [isOpen]);

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContent}>
                <h2>Informe o seu parecer sobre {getMessage()} desta etapa da solicitação:</h2>

                <textarea
                    className={styles.textareaFeedback}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Digite seu parecer aqui..."
                    required
                    rows={4}
                />
                {!isFeedbackValid && <p style={{ color: "red" }}>*O parecer é obrigatório</p>}

                <div className="modalActions">
                    <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
                        Cancelar
                    </button>
                    <button className={`${styles.btn} ${getButtonColor()}`} onClick={handleConfirm}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
