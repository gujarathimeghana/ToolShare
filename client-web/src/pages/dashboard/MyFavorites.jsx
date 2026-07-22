import React, { useEffect, useState } from 'react';
import ToolCard from '../../components/ToolCard';
import api from '../../services/api';

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/favorites');
        setFavorites(res.data);
      } catch (err) {
        console.error('Fetch favorites error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Saved Favorites</h2>
        <p className="text-xs text-slate-500 mt-1">Tools and helpers you have bookmarked for later.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="font-bold text-slate-700 dark:text-slate-300">No bookmarks saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {favorites.map((fav) => (
            fav.tool && <ToolCard key={fav._id} tool={fav.tool} isFavorite={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
