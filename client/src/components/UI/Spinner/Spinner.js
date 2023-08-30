import classes from "./Spinner.module.css";

const Spinner = ({ containerWidth, containerHeight }) => (
  <div
    className={classes["loader-container"]}
    style={{ width: containerWidth, height: containerHeight }}
  >
    <div className={classes.loader}></div>
  </div>
);

export default Spinner;
