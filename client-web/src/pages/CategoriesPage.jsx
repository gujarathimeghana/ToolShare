import React, { useEffect, useState } from 'react';
import CategoryBadge from '../components/CategoryBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../services/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Fetch categories error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tool & Skill Categories</h1>
        <p className="text-sm text-slate-500 mt-1">Browse all tool sharing and local help categories.</p>
      </div>

      {loading ? (
        <SkeletonLoader count={8} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryBadge key={cat._id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
