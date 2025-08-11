import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products/${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <section className="bg-gradient-to-r from-quaternary to-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Welcome to ShopEase
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover amazing products at unbeatable prices. Your one-stop
            destination for quality and convenience.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full px-6 py-4 text-lg border-2 border-secondary rounded-full focus:outline-none focus:border-primary transition-colors pr-16"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
