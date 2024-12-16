import styles from "./toast.module.css";
import CloseIcon from '@mui/icons-material/Close';

const Toast = ({ type = "info", children, close }) => {
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
      <CloseIcon onClick={close} cursor="pointer"/>
      {children}
    </div>
  );
};

export default Toast;
