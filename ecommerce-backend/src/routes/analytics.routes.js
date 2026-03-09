import express from "express";
import {
  getAnalytics,
  getPublicRecommendations,
} from "../controllers/analytics.controllers.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/recommendations", protect, admin, getAnalytics);
analyticsRouter.get("/public-recommendations", getPublicRecommendations);

export default analyticsRouter;
