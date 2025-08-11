import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createProduct } from "@/api/products";
import ProductForm from "@/components/ProductForm";
import toast from "react-hot-toast";

const AddProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !user.is_admin) {
      toast.error("Access denied. Admin privileges required.");
    }
  }, [user]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await createProduct(formData);

      if (response.success) {
        toast.success("Product created successfully!");
        navigate("/products");
      } else {
        toast.error(response.error || "Failed to create product");
      }
    } catch (error) {
      toast.error("An error occurred while creating the product");
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user && !user.is_admin) {
    return (
      <div className="min-h-screen bg-quaternary flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">
            Access denied. Admin privileges required.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Add New Product
        </h1>
        <p className="text-gray-600">Create a new product for your store</p>
      </div>

      {/* Product Form */}
      <ProductForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Create Product"
      />
    </div>
  );
};

export default AddProductPage;
