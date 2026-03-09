import Order from "../models/order.js";
import Product from "../models/product.js";
import fs from "fs";

/** Admin analytics: revenue, orders, products, low stock, recommendations, CSV export. */
export const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("orderItems.product", "name price category image")
      .sort({ createdAt: -1 });

    const products = await Product.find();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0,
    );
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
    const pendingOrders = orders.filter(
      (o) => o.status === "pending" || o.status === "processing",
    ).length;
    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.stock < 10).length;

    const recommendations = products
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 8)
      .map((product) => ({
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        recommendation: "Popular item",
      }));

    const userData = orders.flatMap((order) =>
      order.orderItems.map((item) => ({
        userId: order.user.toString(),
        productId: item.product._id.toString(),
        category: item.product.category,
        price: item.price,
        quantity: item.quantity,
        date: order.createdAt.toISOString(),
      })),
    );

    const csvContent =
      "userId,productId,category,price,quantity,date\n" +
      userData
        .map(
          (row) =>
            `${row.userId},${row.productId},${row.category},${row.price},${row.quantity},${row.date}`,
        )
        .join("\n");

    fs.writeFileSync("rapidminer_input.csv", csvContent);

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        deliveredOrders,
        pendingOrders,
        totalProducts,
        lowStockProducts,
        recommendations,
        csvGenerated: true,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error.message);
    res.status(500).json({
      success: false,
      message: "Analytics processing failed",
      error: error.message,
    });
  }
};

/** Public recommendations for home page (first 8 products). */
export const getPublicRecommendations = async (req, res) => {
  try {
    const products = await Product.find().limit(8);

    const recommendations = products.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      recommendation: "Highly rated",
    }));

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch recommendations",
    });
  }
};
