import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { getAllProducts } from "../api/products";

import HeroSection from "../components/HeroSection";
import ProductsList from "../components/ProductsList";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getAllProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        toast.error(response.error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-quaternary min-h-screen">
      <HeroSection />
      <ProductsList products={products} />
    </div>
  );
};

export default HomePage;
