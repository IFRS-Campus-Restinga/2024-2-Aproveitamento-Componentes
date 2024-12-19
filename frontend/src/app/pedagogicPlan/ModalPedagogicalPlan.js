"use client";
import React, { useState, useEffect, use } from "react";
import {
  pedagogicalPlanCourseCreate,
  pedagogicalPlanCourseEdit,
} from "@/services/PedagogicPlanService"; // Ajuste o caminho do serviço conforme necessário
import { DisciplineList } from "@/services/DisciplineService";
import { courseList } from "@/services/CourseService";

const ModalPedagogicalPlan = ({ plan, onClose }) => {
  const [courses, setCourses] = useState([]);
  const [disciplines, setDisciplines] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    year: "",
    duration: "",
    totalWorkload: "",
    authorization: "",
    start_duration: "",
    end_duration: "",
    total_workload: "",
    turn: "",
    course_id: "",
    discipline_ids: [],
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        year: plan.year || "",
        duration: plan.duration || "",
        total_workload: plan.totalWorkload || "",
        authorization: plan.authorization,
        start_duration: plan.start_duration,
        end_duration: plan.end_duration,
        turn: plan.turn,
        course_id: plan.course.id || "",
        discipline_ids: plan.disciplines.map(discipline => discipline.id) || [],
      });
    }
  }, [plan]);

  const fetchCourses = async () => {
    try {
      const data = await courseList();
      console.log(data);
      setCourses(data.courses);
    } catch (err) {
      console.error("Erro ao buscar cursos:", err);
    }
  };

  const fetchDisciplines = async () => {
    try {
      const data = await DisciplineList();
      console.log(data);
      setDisciplines(data);
    } catch (err) {
      console.error("Erro ao buscar disciplinas:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchDisciplines();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (plan) {
        // Se estiver editando, chama o serviço de update
        await pedagogicalPlanCourseEdit(plan.id, formData); // Chama o serviço para atualizar o plano pedagógico
      } else {
        // Se for criar um novo plano, chama o serviço de create
        await pedagogicalPlanCourseCreate(formData); // Chama o serviço para criar o plano pedagógico
      }
      onClose(); // Fecha o modal após sucesso
    } catch (error) {
      console.error("Erro ao salvar o plano pedagógico:", error);
    }
  };

  const handleMultipleDisciplineChange = (e) => {
    const { options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);

    setFormData((prevState) => ({
      ...prevState,
      discipline_ids: selectedValues, // Atualiza com os IDs das disciplinas selecionadas
    }));
  };

  return (
    <div className="modal">
      <h2>
        {plan ? "Editar Plano Pedagógico" : "Criar Novo Plano Pedagógico"}
      </h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Ano:
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Duração:
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Carga Horária:
          <input
            type="number"
            name="total_workload"
            value={formData.total_workload}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Autorização:
          <input
            type="text"
            name="authorization"
            value={formData.authorization}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          fim vigencia:
          <input
            type="date"
            name="end_duration"
            value={formData.end_duration}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          começo vigencia:
          <input
            type="date"
            name="start_duration"
            value={formData.start_duration}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          turno:
          <input
            type="text"
            name="turn"
            value={formData.turn}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Curso:
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} {/* Ajuste conforme o formato dos dados */}
              </option>
            ))}
          </select>
        </label>
        <label>
          Disciplina:
          <select
            name="disciplines"
            value={formData.discipline_ids}
            onChange={handleMultipleDisciplineChange}
            required
            multiple
          >
            <option value="">Selecione uma disciplina</option>
            {disciplines.map((discipline) => (
              <option key={discipline.id} value={discipline.id}>
                {discipline.name} {/* Ajuste conforme o formato dos dados */}
              </option>
            ))}
          </select>
        </label>
        <div>
          <button type="submit">
            {plan ? "Salvar Alterações" : "Criar Plano"}
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalPedagogicalPlan;
