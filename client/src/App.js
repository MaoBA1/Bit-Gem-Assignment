import React, { Fragment, useContext } from "react";
import Button from "./components/UI/Button/Button";
import Input from "./components/UI/Input/Input";
import AnalyzedImage from "./components/AnalyzedImage/AnalyzedImage";
import ImageContext from "./store/image-context";
import Card from "./components/UI/Card/Card";
import Spinner from "./components/UI/Spinner/Spinner";
import Modal from "./components/UI/Modal/Modal";

function App() {
  const {
    imageData,
    top5Rgb,
    onUploadFile,
    isLoading,
    errorMessage,
    resetErrorMessage,
  } = useContext(ImageContext);

  const buttonClickHandler = () => {
    const selector = document.getElementById("upload-button");
    selector.click();
  };

  const closeModalHandler = () => {
    resetErrorMessage();
  };

  return (
    <Card>
      {errorMessage && (
        <Modal onClose={closeModalHandler}>
          <h1>Error Message</h1>
          <h2>{errorMessage}</h2>
        </Modal>
      )}
      {isLoading ? (
        <Spinner containerWidth={"100vh"} containerHeight={"50vh"} />
      ) : (
        <Fragment>
          {imageData && top5Rgb ? (
            <AnalyzedImage alt="Uploaded" />
          ) : (
            <Button onClick={buttonClickHandler}>
              <h1>Select Image</h1>
              <Input
                id="upload-button"
                display={"none"}
                type={"file"}
                onChange={onUploadFile}
              />
            </Button>
          )}
        </Fragment>
      )}
    </Card>
  );
}

export default App;
