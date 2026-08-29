import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';
import { FiTool, FiDollarSign, FiShield, FiTag, FiImage, FiFileText, FiPlusCircle } from 'react-icons/fi';

const DEFAULT_TOOL_CATEGORIES = [
  'Power Tools',
  'Hand Tools',
  'Gardening',
  'Construction',
  'Automotive',
  'Electrical',
  'Plumbing',
  'Cleaning',
  'Kitchen',
  'Home Improvement',
  'Outdoor',
  'Other'
];

const AddToolPage = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Power Tools');
  const [pricePerDay, setPricePerDay] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [condition, setCondition] = useState('Good');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const data = res.data || res;
        
        let loadedCats = [];
        if (Array.isArray(data) && data.length > 0) {
          loadedCats = data.map(c => ({
            id: c._id || c.name,
            value: c._id || c.name,
            name: c.name
          }));
        }

        // Merge with default categories if any are missing
        DEFAULT_TOOL_CATEGORIES.forEach(defaultCat => {
          if (!loadedCats.some(c => c.name.toLowerCase() === defaultCat.toLowerCase())) {
            loadedCats.push({
              id: defaultCat,
              value: defaultCat,
              name: defaultCat
            });
          }
        });

        setCategoriesList(loadedCats);
        if (loadedCats.length > 0 && !category) {
          setCategory(loadedCats[0].value);
        }
      } catch (err) {
        console.error('Fetch categories error:', err);
        // Fallback to default categories if API fetch fails
        const fallbackCats = DEFAULT_TOOL_CATEGORIES.map(c => ({ id: c, value: c, name: c }));
        setCategoriesList(fallbackCats);
        setCategory(fallbackCats[0].value);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter a tool title.', 'error');
      return;
    }

    if (!category || category === '') {
      showToast('Please select a category.', 'error');
      return;
    }

    if (!pricePerDay || Number(pricePerDay) <= 0) {
      showToast('Please enter a valid daily rental price.', 'error');
      return;
    }

    if (!description.trim()) {
      showToast('Please enter a tool description.', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/tools', {
        title: title.trim(),
        description: description.trim(),
        category: category,
        pricePerDay: Number(pricePerDay),
        securityDeposit: Number(securityDeposit) || 0,
        condition: condition || 'Good',
        images: imageUrl.trim() ? [imageUrl.trim()] : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500']
      });

      showToast('Tool listed successfully! Your tool is now available for neighbor sharing.', 'success');
      navigate('/dashboard/listings');
    } catch (err) {
      console.error('Create tool listing error:', err);
      showToast(err.message || 'Failed to publish tool listing', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentOptions = categoriesList.length > 0
    ? categoriesList
    : DEFAULT_TOOL_CATEGORIES.map(c => ({ id: c, value: c, name: c }));

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-8 shadow-xl">
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
          <FiPlusCircle className="text-lg" /> List A New Tool
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          List a Tool for Sharing
        </h2>
        <p className="text-xs text-slate-500">
          Share your unused power tools or equipment with neighbors and earn extra income.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tool Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tool Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="e.g. DeWalt 20V Cordless Drill Kit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        {/* CATEGORY DROPDOWN */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Category <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-pointer relative z-10 pointer-events-auto"
              required
            >
              <option value="" disabled>-- Select a Category --</option>
              {currentOptions.map((c) => (
                <option key={c.id || c.name} value={c.value}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Daily Price & Security Deposit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Daily Rental Price ($) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 15"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Security Deposit ($)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 50"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tool Condition <span className="text-rose-500">*</span>
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all cursor-pointer relative z-10 pointer-events-auto"
          >
            <option value="Like New">Like New</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        {/* Image URL */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Image URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows="4"
            placeholder="Describe your tool, included accessories, battery chargers, and pickup instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-extrabold text-white text-base btn-gradient shadow-xl hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? 'Creating Listing...' : 'Publish Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddToolPage;
