"use client";
import React, { useState, useEffect } from 'react';
import ModalPedagogicalPlan from './ModalPedagogicalPlan'; // Componente modal
import { pedagogicalPlanCourseListAll, pedagogicalPlanCourseDelete } from '@/services/PedagogicPlanService'; // Ajuste o caminho do serviço conforme necessário
import styles from "./pedagogicPlan.module.css"

const PedagogicalPlan = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await pedagogicalPlanCourseListAll(); // Chama o serviço para obter todos os planos
        console.log("Planos PAGE:", data);
        console.log("Planos results PAGE:", data.results);
        setPlans(data.results);
      } catch (err) {
        console.error("Erro ao buscar planos pedagógicos:", err);
      }
    };
    fetchPlans();
  }, []);

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await pedagogicalPlanCourseDelete(id); // Chama o serviço para excluir o plano pedagógico
      const updatedPlans = plans.filter(plan => plan.id !== id);
      setPlans(updatedPlans); // Atualiza a lista de planos após exclusão
    } catch (error) {
      console.error('Erro ao excluir o plano pedagógico:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div>
      <h1>Planos Pedagógicos</h1>
      <button onClick={() => setIsModalOpen(true)}>Criar Novo Plano</button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ano</th>
            <th>Duração</th>
            <th>Carga Horária</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.name}</td>
              <td>{plan.year}</td>
              <td>{plan.duration}</td>
              <td>{plan.totalWorkload}</td>
              <td>
                <button onClick={() => handleEdit(plan)}>Editar</button>
                <button onClick={() => handleDelete(plan.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <ModalPedagogicalPlan
          plan={selectedPlan}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default PedagogicalPlan;
