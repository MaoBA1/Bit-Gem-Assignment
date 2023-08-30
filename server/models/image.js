import mongoose from "mongoose";
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  imageData: [],
});

export default mongoose.model("Image", imageSchema);
