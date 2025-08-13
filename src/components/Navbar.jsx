import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-quaternary shadow-sm border-b border-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">ShopEase</h1>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              All Products
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                My Orders
              </Link>
            )}
            {isAuthenticated && user.is_admin && (
              <div className="relative group">
                <button className="text-primary hover:text-primary/80 font-medium transition-colors flex items-center">
                  Admin
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary/20 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    to="/admin/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Manage Orders
                  </Link>
                  <Link
                    to="/categories"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Manage Categories
                  </Link>
                  <Link
                    to="/products/add"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Add Product
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-primary hover:text-primary/80 transition-colors"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8l1 5h11M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
            </Link>

            {/* Login Button or User Info */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-primary font-medium">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="bg-secondary text-primary px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-secondary/20 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/products"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              {isAuthenticated && (
                <Link
                  to="/orders"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              {/* Admin Links for Mobile */}
              {isAuthenticated && user.is_admin && (
                <div className="border-t border-secondary/20 pt-3 mt-3">
                  <div className="text-sm text-gray-500 mb-2">Admin</div>
                  <Link
                    to="/admin/orders"
                    className="text-primary hover:text-primary/80 font-medium transition-colors block mb-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Orders
                  </Link>
                  <Link
                    to="/categories"
                    className="text-primary hover:text-primary/80 font-medium transition-colors block mb-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Manage Categories
                  </Link>
                  <Link
                    to="/products/add"
                    className="text-primary hover:text-primary/80 font-medium transition-colors block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Add Product
                  </Link>
                </div>
              )}

              {isAuthenticated ? (
                <div className="flex flex-col space-y-3 border-t border-secondary/20 pt-3 mt-3">
                  <span className="text-primary font-medium">
                    Welcome, {user?.name}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-secondary text-primary px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors font-medium text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
