import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ToolCard from '../../components/ToolCard';
import SkeletonLoader from '../../components/SkeletonLoader';
import RatingStars from '../../components/RatingStars';
import api from '../../services/api';
import { FiPlusCircle, FiStar, FiEye } from 'react-icons/fi';

const MyListings = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/tools/my-listings');
        setTools(res.data || []);
      } catch (err) {
        console.error('Fetch listings error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Tool Listings</h2>
          <p className="text-xs text-slate-500 mt-1">Tools you are currently sharing with neighbors and feedback received.</p>
        </div>
        <Link to="/dashboard/add-tool" className="px-4 py-2 rounded-xl text-xs font-bold text-white btn-gradient flex items-center gap-1.5 shadow-md">
          <FiPlusCircle /> Add Listing
        </Link>
      </div>

      {loading ? (
        <SkeletonLoader count={2} />
      ) : tools.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="font-bold text-slate-700 dark:text-slate-300">You haven't listed any tools yet.</p>
          <p className="text-xs text-slate-500 mt-1">List unused power tools or gardening gear to earn extra income!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div key={tool._id} className="relative flex flex-col justify-between">
              <ToolCard tool={tool} />
              
              {/* Owner Rating Summary Bar overlay */}
              <div className="mx-4 -mt-3 mb-2 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md flex items-center justify-between z-10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Tool Reviews:</span>
                  <RatingStars rating={tool.rating} count={tool.reviewCount} size="text-xs" />
                </div>
                <Link
                  to={`/tools/${tool._id}`}
                  className="text-primary hover:underline font-extrabold flex items-center gap-1"
                >
                  <FiEye /> View Reviews
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
