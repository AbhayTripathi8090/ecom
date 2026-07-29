import { Category } from "../categories/category.model";
import { Order } from "../orders/order.model";
import { Product } from "../products/product.model";
import { User } from "../auth/user.model";

export const getAdminDashboard = async () => {
  const [
    totalUsers,
    activeUsers,
    totalProducts,
    activeProducts,
    totalCategories,
    totalOrders,
    paidOrders,
    pendingOrders,
    processingOrders,
    deliveredOrders,
    revenueResult,
    recentOrders,
    topProducts,
    lowStockCount,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Category.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ paymentStatus: "paid" }),
    Order.countDocuments({ orderStatus: "pending" }),
    Order.countDocuments({ orderStatus: "processing" }),
    Order.countDocuments({ orderStatus: "delivered" }),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
    ]),
    Order.find()
      .sort("-createdAt")
      .limit(5)
      .populate("user", "name email")
      .select("orderNumber totalAmount orderStatus paymentStatus createdAt"),
    Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          quantitySold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 },
    ]),
    Product.countDocuments({ stock: { $lte: 5 } }),
  ]);

  const totalRevenue = revenueResult[0]?.revenue ?? 0;

  return {
    totalProducts,
    totalOrders,
    totalRevenue,
    pendingOrders,
    printingOrders: processingOrders,
    deliveredOrders,
    lowStockProducts: lowStockCount,
    totals: {
      users: totalUsers,
      activeUsers,
      products: totalProducts,
      activeProducts,
      categories: totalCategories,
      orders: totalOrders,
      paidOrders,
      pendingOrders,
      revenue: totalRevenue,
    },
    recentOrders,
    topProducts,
  };
};
