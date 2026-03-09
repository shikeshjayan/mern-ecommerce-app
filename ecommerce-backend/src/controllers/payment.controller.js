import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/order.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/** Create Stripe checkout session and a pending order. */
const createPaymentSession = async (req, res) => {
  try {
    const { products, orderId } = req.body;

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          description: product.description || "",
          images: [product.image || ""],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const order = new Order({
      user: req.user._id,
      orderItems: products.map((p) => ({
        product: p._id,
        quantity: p.quantity,
        price: p.price,
      })),
      totalPrice: products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      ),
      shippingAddress: req.body.shippingAddress || {
        address: "Default Address",
        city: "Default City",
        postalCode: "000000",
        country: "Default Country",
      },
      paymentMethod: "card",
      status: "pending",
    });

    const savedOrder = await order.save();

    const backendUrl =
      process.env.BACKEND_URL ||
      `http://localhost:${process.env.PORT || 5000}`;
    const successUrl = `${backendUrl}/api/v1/payment/success?session_id={CHECKOUT_SESSION_ID}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${process.env.BASE_URL}/payment/cancel?status=cancelled`,
      customer_email: req.user?.email,
      metadata: {
        userId: req.user?._id?.toString(),
        orderId: savedOrder._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Payment error:", error.message);
    res.status(500).json({
      success: false,
      error: "Payment initialization failed",
      details: error.message,
    });
  }
};

/** Verify Stripe session and update order status; refresh auth cookie and redirect. */
const handlePaymentSuccess = async (req, res) => {
  try {
    const sessionId = req.query.session_id;

    if (!sessionId) {
      return res.redirect(
        `${process.env.BASE_URL}/payment/cancel?error=no-session`,
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const orderId = session.metadata?.orderId;
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.status = "processing";
          await order.save();
        }
      }

      res.cookie("token", req.cookies.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.BASE_URL}/dashboard?payment=success`);
    } else {
      res.redirect(
        `${process.env.BASE_URL}/payment/cancel?error=payment-failed`,
      );
    }
  } catch (error) {
    console.error("Payment success handler error:", error.message);
    res.redirect(`${process.env.BASE_URL}/payment/cancel?error=server-error`);
  }
};

export { createPaymentSession, handlePaymentSuccess };
