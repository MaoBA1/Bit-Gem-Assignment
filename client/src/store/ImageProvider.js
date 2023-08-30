import { useReducer } from "react";
import ImageContext from "./image-context";
import axios from "axios";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const baseServerURL = "http://localhost:3001/api";

const maxChunkSize = 1024 * 1024; // 1 megabyte in bytes

const defaultImageState = {
  imageData: null,
  top5Rgb: null,
  checksumValue: null,
  isLoading: false,
  errorMessage: null,
  resetErrorMessage: () => {},
  reader: new FileReader(),
  imageObject: new Image(),
  onReset: () => {},
};

const imageReducer = (state, action) => {
  switch (action.type) {
    case "SET_TOP_FIVE_RGB":
      return {
        ...state,
        top5Rgb: action.rgb,
      };
    case "STORE_IMAGE_URL":
      return {
        ...state,
        imageData: action.imageUrl,
      };
    case "STORE_CHECKSUM":
      return {
        ...state,
        checksumValue: action.checksumValue,
      };
    case "SET_IS_LOADING":
      return {
        ...state,
        isLoading: !state.isLoading,
      };
    case "RESET_ERROR":
      return {
        ...state,
        errorMessage: null,
        isLoading: !state.isLoading,
      };
    case "SET_ERROR_MESSAGE":
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    case "RESET_CONTEXT":
      return {
        imageData: null,
        top5Rgb: null,
        checksumValue: null,
        isLoading: false,
        errorMessage: null,
        resetErrorMessage: () => {},
        reader: new FileReader(),
        imageObject: new Image(),
        onReset: () => {},
      };

    default:
      return defaultImageState;
  }
};

function ImageProvider(props) {
  const [imageState, dispatchImageAction] = useReducer(
    imageReducer,
    defaultImageState
  );

  const analyzeImage = (image) => {
    canvas.width = image.width;
    canvas.height = image.height;

    // Drawing the image to the canvas from top left corner of the canvas (0,0)
    ctx.drawImage(image, 0, 0);

    // This method provid array of pixels from top left corner of the canvas with the width and height of the image
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let rgbObject = [];
    let countOfColors = 0;
    // Every pixel in this array represented by four consecutive values R, G, B, A(alpha)
    // So for each iteration the i move forward 4 index to skip the alpha value
    for (let i = 0; i < pixelData.length; i += 4) {
      countOfColors++;
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];
      const rgbColor = `R:${r} G:${g} B:${b}`;

      // To sort the RGB values by value and count
      // Im adding to the rgbObject the values as the keys and the counters as a values
      if (rgbColor in rgbObject) {
        rgbObject[rgbColor] += 1;
      } else {
        rgbObject[rgbColor] = 1;
      }
    }
    // Transforming the rgbObject into 2d array, every index in it contains array of two index
    // 0 - The RGB value
    // 1 - The count
    const rgbArray = Object.entries(rgbObject);
    const top5 = rgbArray.sort((a, b) => b[1] - a[1]).slice(0, 5);
    // Changing every item on the top 5 colors array to array that
    // contain the color and the The percentage of occurrences of the color
    const formattedTop5 = top5.map((item) => [
      item[0],
      ((item[1] / countOfColors) * 100).toFixed(2),
    ]);
    dispatchImageAction({ type: "SET_TOP_FIVE_RGB", rgb: formattedTop5 });
    dispatchImageAction({ type: "SET_IS_LOADING" });
  };

  const uploadChunk = (chunk) => {
    axios
      .post(baseServerURL + "/image/imageUpload", chunk, {
        headers: { "Content-Type": "application/octet-stream" }, // Set binary content type
      })
      .then((result) => {
        console.log(result.data);
      });
  };

  const sendChecksumValue = async (checksum) => {
    axios
      .post(baseServerURL + "/image/sendChecksumValue", {
        checksum: checksum,
      })
      .then((result) => {
        // If everything worked properly I'm expecting to receive back the chunks array from the server
        // I'm combining all the chunks into one array of buffers so I can preview the image
        const chunks = result.data.image;
        const combinedBuffer = new Uint8Array(
          chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk.data)), [])
        );
        dispatchImageAction({
          type: "STORE_IMAGE_URL",
          imageUrl: URL.createObjectURL(new Blob([combinedBuffer])),
        });
        // I'm loading the image into new Image Object so I can analyze it
        const img = imageState.imageObject;
        img.onload = () => {
          analyzeImage(img);
        };
        img.src = URL.createObjectURL(new Blob([combinedBuffer]));
      })
      .catch((error) => {
        dispatchImageAction({
          type: "SET_ERROR_MESSAGE",
          errorMessage: error.response.data.message,
        });
      });
  };

  const calculateXORChecksum = (buffer) => {
    // On this method I'm running through the array and performing xor operation on all of the values
    let checksumValue = 0;
    for (let i = 0; i < buffer.length; i++) {
      checksumValue ^= buffer[i];
    }
    return checksumValue;
  };

  const uploadImageHandler = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    dispatchImageAction({ type: "SET_IS_LOADING" });
    const reader = imageState.reader;
    let offset = 0;
    let chunks = [];

    reader.addEventListener("load", async () => {
      const chunkBuffer = new Uint8Array(reader.result); // for every 'load' event I'm getting a chunk of the file and convert it to array with 8 bits on each index
      uploadChunk(reader.result);
      chunks.push(chunkBuffer); // then pushing it to the empty chunks array
      offset += chunkBuffer.length; // then adding the length of the Unit8Array to the offset
      if (offset < file.size) {
        // if the offset is still smaller then the whole file size I'm reading the next chunk
        readNextChunk(file, offset, reader);
      } else {
        // else I'm combining all the chunks into one Unit8Array
        const combinedBuffer = new Uint8Array(
          chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])
        );
        let checksum = calculateXORChecksum(combinedBuffer);
        dispatchImageAction({
          type: "STORE_CHECKSUM",
          checksumValue: checksum,
        });
        sendChecksumValue(checksum);
      }
    });

    const readNextChunk = () => {
      const chunk = file.slice(offset, offset + maxChunkSize);
      reader.readAsArrayBuffer(chunk);
      // when using 'readAsArrayBuffer' method
      //the load eventListener is called and listening to new event
      // on every event the reader.result will hold the chunk that I'm sending to 'readAsArrayBuffer'
    };

    readNextChunk();
  };

  const resetErrorMessageHandler = () => {
    dispatchImageAction({ type: "RESET_ERROR" });
  };

  const resetContextHandler = () => {
    dispatchImageAction({ type: "RESET_CONTEXT" });
  };

  const imageContextValue = {
    imageData: imageState.imageData,
    top5Rgb: imageState.top5Rgb,
    checksumValue: imageState.checksumValue,
    onUploadFile: uploadImageHandler,
    isLoading: imageState.isLoading,
    errorMessage: imageState.errorMessage,
    resetErrorMessage: resetErrorMessageHandler,
    onReset: resetContextHandler,
  };

  return (
    <ImageContext.Provider value={imageContextValue}>
      {props.children}
    </ImageContext.Provider>
  );
}

export default ImageProvider;
