import express from "express";
import {
  imageUpload,
  sendChecksumValue,
} from "../controllers/image-controllers.js";
const router = express.Router();

router.post("/imageUpload", imageUpload);

router.post("/sendChecksumValue", sendChecksumValue);

export default router;
