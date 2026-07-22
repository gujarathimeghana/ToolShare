import React, { useEffect, useState } from 'react';
import HelperCard from '../components/HelperCard';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../services/api';
import { FiSearch, FiUserCheck } from 'react-icons/fi';

const BrowseHelpersPage = () => {
  const [helpers, setHelpers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [loading, setLoading] = useState(true);

  const skillsList = [
    'Electrician', 'Plumber', 'Carpenter', 'Painter',
    'Cleaner', 'Gardener', 'Mechanic', 'Mover', 'Tutor', 'Technician'
  ];

  const fetchHelpers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (selectedSkill) query.append('category', selectedSkill);

      const res = await api.get(`/help/helpers?${query.toString()}`);
      setHelpers(res.data);
    } catch (err) {
      console.error('Fetch helpers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelpers();
  }, [selectedSkill]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHelpers();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Find Local Skilled Helpers</h1>
        <p className="text-sm text-slate-500 mt-1">Hire trusted neighbors for plumbing, electrical, repairs, moving, and tutoring.</p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glassmorphism border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 w-full">
          <div className="flex-1 flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <FiSearch className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search helper by name or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>
          <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold btn-gradient">
            Search
          </button>
        </form>

        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 font-medium focus:outline-none w-full md:w-auto"
        >
          <option value="">All Skills</option>
          {skillsList.map((skill, idx) => (
            <option key={idx} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {/* Helpers Grid */}
      {loading ? (
        <SkeletonLoader count={3} />
      ) : helpers.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No helpers found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {helpers.map((helper) => (
            <HelperCard key={helper._id} helper={helper} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseHelpersPage;
