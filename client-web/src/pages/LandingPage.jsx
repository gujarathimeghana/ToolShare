import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ToolCard from '../components/ToolCard';
import HelperCard from '../components/HelperCard';
import CategoryBadge from '../components/CategoryBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import api from '../services/api';
import { FiCheckCircle, FiShield, FiHeart, FiZap, FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toolsRes, catRes, helpersRes] = await Promise.all([
          api.get('/tools'),
          api.get('/categories'),
          api.get('/help/helpers')
        ]);
        setTools(toolsRes.data.slice(0, 6));
        setCategories(catRes.data.slice(0, 8));
        setHelpers(helpersRes.data.slice(0, 3));
      } catch (err) {
        console.error('Landing page fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <HeroSection />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Explore Popular Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">Everything you need for DIY, gardening, cleaning & repairs.</p>
          </div>
          <Link to="/categories" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryBadge key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Nearby Tools Available Now
            </h2>
            <p className="text-sm text-slate-500 mt-1">Rent from verified neighbors right in your area.</p>
          </div>
          <Link to="/tools" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            Browse All Tools <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </div>
        )}
      </section>

      {/* Top Local Helpers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Hire Local Skilled Helpers
            </h2>
            <p className="text-sm text-slate-500 mt-1">Plumbers, electricians, painters, and handy neighbors ready to help.</p>
          </div>
          <Link to="/helpers" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            Find All Helpers <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {helpers.map((helper) => (
              <HelperCard key={helper._id} helper={helper} />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Features */}
      <section className="bg-slate-100/70 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why Neighbors Choose Neighborly</h2>
            <p className="text-sm text-slate-500 mt-2">Safe, sustainable, hyper-local tool sharing built on community trust.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                <FiShield />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Verified Profiles</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                All members undergo phone and identity verification to ensure your tools remain in trustworthy hands.
              </p>
            </div>

            <div className="p-8 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-2xl font-bold">
                <FiZap />
              </div>
              <p className="font-bold text-xl text-slate-900 dark:text-white">Flexible Cash & Pay Later</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No credit card required upfront. Pay in cash on pickup or arrange flexible terms directly with owners.
              </p>
            </div>

            <div className="p-8 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-bold">
                <FiHeart />
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Eco & Sustainable</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Reduce manufacturing demand and landfill clutter by sharing existing quality tools in your neighborhood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 mt-2">Everything you need to know about borrowing and lending.</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "Is registration free?", a: "Yes! Neighborly is 100% free to join, list tools, and request local help." },
            { q: "How do security deposits work?", a: "Owners specify security deposits for valuable tools. Deposited funds are held or confirmed cash-on-pickup and returned upon undamaged tool return." },
            { q: "What if a tool is damaged?", a: "Neighborly provides a built-in Report and Claims system so admins can review disputes and enforce damage resolution." }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl glassmorphism border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">{item.q}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
