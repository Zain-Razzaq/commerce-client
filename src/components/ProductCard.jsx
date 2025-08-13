import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { addToLocalCart, addToCart } from "@/api/cart";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      if (user) {
        const response = await addToCart(product.id, 1);
        if (response.success) {
          toast.success("Product added to cart!");
        } else {
          toast.error("Failed to add product to cart");
        }
      } else {
        addToLocalCart(product.id, 1);
        toast.success("Product added to cart!");
      }
    } catch {
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-secondary/20 h-full flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden relative">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center hover:scale-105 transition-transform duration-300">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-gray-500 font-medium">ShopEase</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Product Name */}
        <h3 className="font-semibold text-lg text-primary mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-primary">
            ${parseFloat(product.price).toFixed(2)}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Stock Status */}
        <div className="mb-4">
          {product.stock > 0 ? (
            <span className="text-sm text-green-600 font-medium">
              In Stock ({product.stock} available)
            </span>
          ) : (
            <span className="text-sm text-red-600 font-medium">
              Out of Stock
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            product.stock > 0
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-secondary text-gray-500 cursor-not-allowed"
          }`}
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
