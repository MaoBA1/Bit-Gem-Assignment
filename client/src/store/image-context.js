import React from "react";

const ImageContext = React.createContext({
  imageData: null,
  top5Rgb: null,
  checksumValue: null,
  onUploadFile: (event) => {},
  isLoading: false,
  errorMessage: null,
  resetErrorMessage: () => {},
  reader: new FileReader(),
  onReset: () => {},
  imageObject: new Image(),
});

export default ImageContext;
