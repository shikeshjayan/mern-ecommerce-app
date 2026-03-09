import express from "express";
import isObjectIdValid from "../middlewares/validateObjectId.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getUserProfile,
  login,
  logout,
  register,
  updateUser,
  forgotPassword,
} from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.get("/", protect, admin, getAllUsers);
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.patch("/forgot-password", forgotPassword);

userRouter.get("/profile", protect, getUserProfile);
userRouter.put("/:id", protect, isObjectIdValid, updateUser);
userRouter.delete("/:id", protect, admin, isObjectIdValid, deleteUser);

export default userRouter;
