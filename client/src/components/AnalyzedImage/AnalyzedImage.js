import { useContext } from "react";
import Card from "../UI/Card/Card";
import Image from "../UI/Image/Image";
import classes from "./AnalyzedImage.module.css";
import Colors from "./Colors";
import ImageContext from "../../store/image-context";

function AnalyzedImage({ alt }) {
  const { imageData, top5Rgb, onReset } = useContext(ImageContext);
  return (
    <Card className={classes["image-container"]}>
      <section className={classes["image-section"]}>
        <Image src={imageData} alt={alt} />
        <Colors rgbData={top5Rgb} />
      </section>
      <section>
        <button onClick={onReset}>Reset</button>
      </section>
    </Card>
  );
}

export default AnalyzedImage;
