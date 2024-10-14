import styles from "./filterCheckbox.module.css";

const FilterCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className={styles.container}>
      {label}
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default FilterCheckbox;
