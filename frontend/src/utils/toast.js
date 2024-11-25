import styles from "./toast.module.css";

const Toast = ({ type = "info", children }) => {
  const backgroundColors = {
    success: "#4caf50", // Verde
    error: "#f44336",   // Vermelho
    info: "#2196f3",    // Azul
    warning: "#ff9800", // Laranja
  };

  return (
    <div
      className={styles.toastContainer}
      style={{ backgroundColor: backgroundColors[type] || "#2196f3" }}
    >
      {children}
    </div>
  );
};

export default Toast;
