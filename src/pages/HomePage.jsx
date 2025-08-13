import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { getAllProducts } from "../api/products";

import HeroSection from "../components/HeroSection";
import ProductsList from "../components/ProductsList";
import Pagination from "../components/Pagination";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(currentPage);
        if (response.success) {
          setProducts(response.data);
          setPagination(response.pagination);
        } else {
          toast.error(response.error);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-quaternary min-h-screen">
      <HeroSection />
      {products.length > 0 ? (
        <>
          <ProductsList products={products} />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
