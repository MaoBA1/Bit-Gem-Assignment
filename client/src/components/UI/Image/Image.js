import classes from "./Image.module.css";

function Image({ src, alt }) {
  return <img className={classes} src={src} alt={alt} />;
}

export default Image;
