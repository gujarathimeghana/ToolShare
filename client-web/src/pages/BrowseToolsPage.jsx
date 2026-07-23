import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../services/api';
import { FiSearch, FiFilter, FiMapPin, FiGrid, FiList } from 'react-icons/fi';

const BrowseToolsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchTools = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (selectedCategory) query.append('category', selectedCategory);
      if (minPrice) query.append('minPrice', minPrice);
      if (maxPrice) query.append('maxPrice', maxPrice);
      if (sort) query.append('sort', sort);

      const res = await api.get(`/tools?${query.toString()}`);
      setTools(res.data);
    } catch (err) {
      console.error('Fetch tools error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      const res = await api.get('/categories');
      setCategories(res.data);
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchTools();
  }, [selectedCategory, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTools();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Browse Neighborhood Tools</h1>
          <p className="text-sm text-slate-500 mt-1">Discover drills, saws, mowers, ladders, and party gear in your area.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glassmorphism border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 w-full">
          <div className="flex-1 flex items-center px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <FiSearch className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search tools or location (City, Area)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold btn-gradient">
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : tools.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No tools found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or location filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseToolsPage;
