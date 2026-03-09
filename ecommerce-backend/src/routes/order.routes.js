import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controllers.js";
import isObjectIdValid from "../middlewares/validateObjectId.js";

const orderRouter = express.Router();

orderRouter.post("/", protect, createOrder);
orderRouter.get("/myorders", protect, getUserOrders);
orderRouter.get("/:id", protect, isObjectIdValid, getOrderById);
orderRouter.delete("/:id", protect, isObjectIdValid, deleteOrder);

orderRouter.get("/", protect, admin, getAllOrders);
orderRouter.put("/:id", protect, admin, isObjectIdValid, updateOrder);

export default orderRouter;
