import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ImageRoutes from "./routes/image-routes.js";
import path from "path";

const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.use(express.raw({ limit: "1mb" }));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/image", ImageRoutes);

app.listen(3001, () => {
  console.log("server listening on port 3001...");
});
