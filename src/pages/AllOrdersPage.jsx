import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllOrders } from "@/api/orders";
import OrderList from "@/components/OrderList";

const AllOrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.is_admin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }

    loadOrders();
  }, [user, navigate, authLoading]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();
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

  const counts = getOrderCounts();
  const filteredOrders = getFilteredOrders();

  return (
    <div className="min-h-screen bg-quaternary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">All Orders - Admin</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Orders Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold text-blue-600">{counts.approved}</p>
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
          showAdminActions={true}
          emptyMessage="No orders found"
          emptyDescription={
            filter === "all"
              ? "No orders have been placed yet."
              : `No ${filter} orders found.`
          }
        />
      </div>
    </div>
  );
};

export default AllOrdersPage;
