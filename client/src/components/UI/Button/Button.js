import styles from "./Button.module.css";

function Button({ className, type, children, onClick }) {
  const classes = `${styles["button-container"]} ${className}`;
  return (
    <button className={classes} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
