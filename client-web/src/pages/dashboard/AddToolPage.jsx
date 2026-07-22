import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import api from '../../services/api';

const AddToolPage = () => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [condition, setCondition] = useState('Good');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get('/categories');
      setCategories(res.data);
      if (res.data.length > 0) setCategory(res.data[0]._id);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tools', {
        title,
        description,
        category,
        pricePerDay: Number(pricePerDay),
        securityDeposit: Number(securityDeposit) || 0,
        condition,
        images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500']
      });
      showToast('Tool listed successfully!', 'success');
      navigate('/dashboard/listings');
    } catch (err) {
      showToast(err.message || 'Failed to list tool', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-6">
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">List a Tool for Sharing</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tool Title</label>
          <input
            type="text"
            placeholder="e.g. DeWalt 20V Cordless Drill Kit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
            required
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Daily Price ($)</label>
            <input
              type="number"
              placeholder="15"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Security Deposit ($)</label>
            <input
              type="number"
              placeholder="50"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
          >
            <option value="Like New">Like New</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Image URL (Optional)</label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
          <textarea
            rows="4"
            placeholder="Describe your tool, included accessories, and pickup instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            required
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-white btn-gradient">
          {loading ? 'Creating Listing...' : 'Publish Listing'}
        </button>
      </form>
    </div>
  );
};

export default AddToolPage;
