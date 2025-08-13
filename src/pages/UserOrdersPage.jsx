import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserOrders } from "@/api/orders";
import OrderList from "@/components/OrderList";

const UserOrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user && !authLoading) {
      toast.error("Please login to view your orders");
      navigate("/login");
      return;
    }

    loadOrders();
  }, [user, navigate, authLoading]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await getUserOrders();
      if (response.success) {
        setOrders(response.data);
      } else {
        toast.error(response.error);
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.status?.toLowerCase() === filter);
  };

  const getOrderCounts = () => {
    const counts = {
      all: orders.length,
      pending: 0,
      approved: 0,
    };

    orders.forEach((order) => {
      if (order.status?.toLowerCase() === "pending") {
        counts.pending++;
      } else if (order.status?.toLowerCase() === "approved") {
        counts.approved++;
      }
    });

    return counts;
  };

  const getTotalSpent = () => {
    return orders
      .filter((order) => order.status?.toLowerCase() == "approved")
      .reduce(
        (total, order) =>
          total +
          order.products.reduce(
            (total, product) => total + product.price * product.quantity,
            0
          ),
        0
      );
  };

  const counts = getOrderCounts();
  const filteredOrders = getFilteredOrders();
  const totalSpent = getTotalSpent();

  return (
    <div className="min-h-screen bg-quaternary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">
              Pending Orders
            </h3>
            <p className="text-2xl font-bold text-blue-600">{counts.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
            <p className="text-2xl font-bold text-green-600">
              ${totalSpent.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-2 p-4">
            {[
              { key: "all", label: "All Orders" },
              { key: "pending", label: "Pending" },
              { key: "approved", label: "Approved" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab.key
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label} ({counts[tab.key]})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <OrderList
          orders={filteredOrders}
          loading={loading}
          onUpdate={loadOrders}
          showAdminActions={user?.is_admin}
        />

        {/* Empty State Action */}
        {!loading && orders.length === 0 && (
          <div className="text-center">
            <Link
              to="/products"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;
