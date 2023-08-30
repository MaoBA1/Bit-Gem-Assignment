let chunks = [];

// In this methode I'm combining all the chunks into one array of buffers
// and run through the array and perform xor operation on all of the values
const calculateXORChecksum = () => {
  const combinedBuffer = new Uint8Array(
    chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [])
  );
  let checksumValue = 0;
  for (let i = 0; i < combinedBuffer.length; i++) {
    checksumValue ^= combinedBuffer[i];
  }
  return checksumValue;
};

// In this method I'm getting a piece of the file from the client and storing it temporarily in the chunks array
export const imageUpload = (request, response) => {
  const chunk = request.body;
  const chunkBuffer = chunk;
  chunks.push(chunkBuffer);
  return response.status(200).json({
    message: "recived!",
  });
};

// This method runs when I receive  all the pieces of the image
// and I'm checking the checksum value and comparing it to the checksum value that I received
// from the client and if both values are the same I'm returning back the photo to the client
export const sendChecksumValue = (request, response) => {
  const checksum = request.body.checksum;
  let checksumValidation = calculateXORChecksum() === checksum;
  if (checksumValidation) {
    const image = chunks;
    chunks = [];
    return response.status(200).json({
      message: "Your file transferred successfully!",
      checksumValidation,
      image,
    });
  } else {
    return response.status(500).json({
      message: "The Image upload was failed... something went wrong...",
    });
  }
};
