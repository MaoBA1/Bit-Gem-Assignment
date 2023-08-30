import classes from "./Colors.module.css";
import Rgb from "./Rgb";

function Colors({ rgbData }) {
  const rgb = rgbData.map((item, index) => {
    return <Rgb key={index} rgb={item[0]} precent={item[1]} />;
  });
  return <div className={classes["colors-container"]}>{rgb}</div>;
}

export default Colors;
