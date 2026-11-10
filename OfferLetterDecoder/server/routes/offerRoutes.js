import express from "express";

import upload from "../middleware/uploadMiddleware.js";
import { analyzeOffer } from "../controllers/offerController.js";

const router = express.Router();

router.post("/analyze", upload.single("offerLetter"), analyzeOffer);

export default router;
