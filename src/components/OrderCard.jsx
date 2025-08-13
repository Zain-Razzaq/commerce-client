import { useState } from "react";
import toast from "react-hot-toast";
import { updateOrderStatus, deleteOrder } from "@/api/orders";
import { Link } from "react-router-dom";

const OrderCard = ({ order, onUpdate, showAdminActions = false }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await updateOrderStatus(order.id);
      if (response.success) {
        toast.success(`Order approved successfully`);
        if (onUpdate) onUpdate();
      } else {
        toast.error(response.error);
      }
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    setIsUpdating(true);
    try {
      const response = await deleteOrder(order.id);
      if (response.success) {
        toast.success("Order deleted successfully");
        if (onUpdate) onUpdate();
      } else {
        toast.error(response.error);
      }
    } catch {
      toast.error("Failed to delete order");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalAmount = () => {
    return order.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order.id}
          </h3>
          <p className="text-sm text-gray-500">
            Placed on {formatDate(order.created_at)}
          </p>
          {showAdminActions && order.user && (
            <p className="text-sm text-gray-600 mt-1">
              Customer: {order.user.name} ({order.user.email})
            </p>
          )}
        </div>
        <div className="text-right">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              order.status?.toLowerCase() === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {order.status}
          </span>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            ${getTotalAmount().toFixed(2)}
          </p>
        </div>
      </div>

      {/* Delivery Address */}
      {order.shipping_address && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            Delivery Address:
          </h4>
          <p className="text-sm text-gray-600">{order.shipping_address}</p>
        </div>
      )}

      {/* Order Items */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items:</h4>
        <div className="space-y-2">
          {order.products?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div>
                  <Link
                    to={`/product/${item.product_id}`}
                    className="font-medium text-sm"
                  >
                    {item.product_name || "Product"}
                  </Link>
                  <p className="text-xs text-gray-500">
                    Quantity: {item.quantity} × $
                    {parseFloat(item.price).toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="font-medium text-sm">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Actions */}
      {showAdminActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {order.status?.toLowerCase() === "pending" && (
            <button
              onClick={() => handleStatusUpdate("approved")}
              disabled={isUpdating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
            >
              Approve
            </button>
          )}

          <button
            onClick={handleDeleteOrder}
            disabled={isUpdating}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
