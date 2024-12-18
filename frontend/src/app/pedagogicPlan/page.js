"use client";
import { useEffect, useState } from "react";
import {
  pedagogicalPlanCourseListAll,
  pedagogicalPlanCourseCreate,
  pedagogicalPlanCourseEdit,
  pedagogicalPlanCourseDelete,
} from "@/services/PedagogicalPlanCourseService";

const PedagogicalPlanCoursePage = () => {
  const [plans, setPlans] = useState([]);

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

  const handleCreate = async (newPlanData) => {
    try {
      const newPlan = await pedagogicalPlanCourseCreate(newPlanData);
      console.log("Novo plano criado:", newPlan);
      // Atualizar a lista após criação
      setPlans((prevPlans) => [...prevPlans, newPlan]);
    } catch (err) {
      console.error("Erro ao criar plano pedagógico:", err);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      const updatedPlan = await pedagogicalPlanCourseEdit(id, updatedData);
      console.log("Plano atualizado:", updatedPlan);
      // Atualizar a lista após edição
      setPlans((prevPlans) =>
        prevPlans.map((plan) => (plan.id === id ? updatedPlan : plan))
      );
    } catch (err) {
      console.error("Erro ao editar plano pedagógico:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const success = await pedagogicalPlanCourseDelete(id);
      if (success) {
        console.log("Plano deletado com sucesso");
        // Atualizar a lista após exclusão
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== id));
      }
    } catch (err) {
      console.error("Erro ao deletar plano pedagógico:", err);
    }
  };

  return (
    <div>
      <h1>Planos Pedagógicos</h1>
      <div>
        {/* Renderizar lista de planos */}
        {plans.map((plan) => (
          <div key={plan.id}>
            <span>{plan.name}</span>
            <button onClick={() => handleEdit(plan.id, { name: "Novo Nome" })}>
              Editar
            </button>
            <button onClick={() => handleDelete(plan.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PedagogicalPlanCoursePage;
