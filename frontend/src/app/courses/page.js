"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "./course.module.css";
import ModalCourse from "@/components/Modal/ModalCourse/modal";
import { courseList } from "@/services/CourseService";


const Course = () => {
  const [courses, setCourses] = useState([]);
  const [disciplinesNames, setDisciplinesNames] = useState({});
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseList();
        setCourses(data.courses);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCourses();
  }, []);

  const openModalForEdit = (course) => {
    setEditData(course);
    setModal(true);
  };

  const closeModal = () => {
    setEditData(null);
    setModal(false);
  };

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.scrollableTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cursos</th>
              <th>Disciplinas</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} onClick={() => openModalForEdit(course)}>
                <td>{course.name ?? "N/A"}</td>
                <td>
                  <button
                      className={styles.linkButton}
                      onClick={() => router.push("/disciplinas")}
                  >
                    Ver Disciplinas
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setModal(true)} className={styles.addButton}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </button>
      {modal && <ModalCourse onClose={closeModal} editData={editData} />}
    </div>
  );
};

export default Course;
