import express from "express";

import { processImage } from "../controllers/imageController.js";

const imageRoute = express.Router();

imageRoute.get("/", processImage);

export default imageRoute;
