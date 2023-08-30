import classes from "./Rgb.module.css";

function Rgb({ rgb, precent }) {
  let splittedRgb = rgb.split(" ");
  let formattedRgb = {};
  for (let i = 0; i < splittedRgb.length; i++) {
    let key = splittedRgb[i].split(":")[0];
    let value = splittedRgb[i].split(":")[1];
    formattedRgb[key] = value;
  }

  let backgroundColor = `rgb(${formattedRgb["R"]},${formattedRgb["G"]},${formattedRgb["B"]})`;

  return (
    <div className={classes["rgb-container"]} style={{ backgroundColor }}>
      <h3>{rgb}</h3>
      <p>{precent}%</p>
    </div>
  );
}

export default Rgb;
