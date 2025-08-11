import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/categories";

const CategoriesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success) {
        setCategories(response.data);
      } else {
        toast.error(response.error);
      }
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    if (user?.is_admin) {
      fetchCategories();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (editingCategory) {
        response = await updateCategory(editingCategory.id, formData);
      } else {
        response = await createCategory(formData);
      }

      if (response.success) {
        toast.success(
          editingCategory
            ? "Category updated successfully"
            : "Category created successfully"
        );
        handleCloseModal();
        fetchCategories();
      } else {
        toast.error(response.error);
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCategory(id);
      if (response.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(response.error);
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      {user?.is_admin ? (
        <div className="min-h-screen bg-quaternary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">
                  Category Management
                </h1>
                <p className="text-gray-600">Manage product categories</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 sm:mt-0 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add New Category
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-sm border border-secondary/20 p-6"
                >
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {category.name}
                  </h3>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  No categories found.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Your First Category
                </button>
              </div>
            )}

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-tertiary/50  flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-primary">
                        {editingCategory ? "Edit Category" : "Add New Category"}
                      </h2>
                      <button
                        onClick={handleCloseModal}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-6 h-6 cursor-pointer"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter category name"
                        />
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          {editingCategory ? "Update" : "Create"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-quaternary flex flex-col items-center justify-center gap-4">
          <div className="text-primary text-lg">
            Access denied. Admin privileges required.
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
