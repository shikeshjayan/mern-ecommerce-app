import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export default generateToken;
