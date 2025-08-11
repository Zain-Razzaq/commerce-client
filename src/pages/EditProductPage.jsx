import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "@/api/products";
import ProductForm from "@/components/ProductForm";
import toast from "react-hot-toast";

const EditProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    if (user && !user.is_admin) {
      toast.error("Access denied. Admin privileges required.");
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoadingProduct(true);
      const response = await getProductById(id);

      if (response.success) {
        setProduct(response.data);
      } else {
        toast.error(response.error || "Failed to fetch product");
        navigate("/products");
      }
    } catch {
      toast.error("An error occurred while fetching the product");
      navigate("/products");
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const response = await updateProduct(id, formData);

      if (response.success) {
        toast.success("Product updated successfully!");
        navigate("/products");
      } else {
        toast.error(response.error || "Failed to update product");
      }
    } catch (error) {
      toast.error("An error occurred while updating the product");
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-quaternary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-quaternary flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Product not found</p>
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

  if (user && !user.is_admin) {
    return (
      <div className="min-h-screen bg-quaternary flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Access denied. Admin privileges required.</p>
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
    <div className="min-h-screen bg-quaternary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Edit Product</h1>
              <p className="text-gray-600 mt-1">Update product information</p>
            </div>
          </div>
        </div>

        {/* Product Form */}
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText="Update Product"
        />
      </div>
    </div>
  );
};

export default EditProductPage;
