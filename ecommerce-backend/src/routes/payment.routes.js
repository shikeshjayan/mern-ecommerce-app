import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

import { protect } from "../middlewares/authMiddleware.js";
import {
  createPaymentSession,
  handlePaymentSuccess,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Create Stripe checkout session (requires login)
router.post("/makepayment", protect, createPaymentSession);

// Success redirect: verify payment, update order, refresh cookie
router.get("/success", handlePaymentSuccess);

// Optional webhook for production (server-side payment verification)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        // Update order status in DB if needed
        break;
      default:
        break;
    }

    res.json({ received: true });
  },
);

export default router;
