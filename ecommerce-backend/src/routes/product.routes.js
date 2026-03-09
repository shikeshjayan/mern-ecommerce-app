import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controllers.js";
import isObjectIdValid from "../middlewares/validateObjectId.js";

const productRouter = express.Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:id", isObjectIdValid, getProductById);

productRouter.post("/", protect, admin, createProduct);
productRouter.put("/:id", protect, admin, isObjectIdValid, updateProduct);
productRouter.delete("/:id", protect, admin, isObjectIdValid, deleteProduct);

export default productRouter;
