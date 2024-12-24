const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model"); 

exports.submitOrder = async (req, res) => {
  try {
    const { products, customerName, phone, address, total } = req.body;

    if (
      !customerName ||
      !phone ||
      !address ||
      !products ||
      products.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, and the cart must not be empty.",
      });
    }

    const productIds = products.map((p) => p.id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    const order = new Order({
      user: req.session.user ? req.session.user._id : null,
      products: products.map((product) => {
        const dbProduct = dbProducts.find(
          (p) => p._id.toString() === product.id
        );
        return {
          product: product.id,
          quantity: product.quantity,
          price: dbProduct ? dbProduct.price : product.price,
        };
      }),
      totalPrice: parseFloat(total),
      customerName,
      phone,
      address,
      status: "Pending", 
    });

    await order.save();

    res.json({
      success: true,
      message: "Order placed successfully!",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Order submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order. Please try again later.",
    });
  }
};

exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "user",
        select: "email", 
        options: {
          strictPopulate: false,
        },
      })
      .populate({
        path: "products.product",
        select: "title price", 
        options: {
          strictPopulate: false,
        },
      })
      .sort({ createdAt: -1 });

    const processedOrders = orders.map((order) => {
      const processedOrder = order.toObject();

      processedOrder.user = processedOrder.user || { email: "Guest User" };
      processedOrder.status = processedOrder.status || "Pending";
      processedOrder.totalPrice = processedOrder.totalPrice || 0;
      processedOrder.products = processedOrder.products || [];

      return processedOrder;
    });

    res.render("admin/orders", {
      pageTitle: "Manage Orders",
      orders: processedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).render("error", {
      message: "Error fetching orders",
      error: error.message,
    });
  }
};
