import React from 'react';
import { FiTool, FiUsers, FiMapPin, FiMessageSquare, FiShield, FiDollarSign } from 'react-icons/fi';

const FeaturesPage = () => {
  const features = [
    { icon: <FiTool />, title: "Tool Marketplace", desc: "List, search, filter, and borrow tools across 11+ categories." },
    { icon: <FiUsers />, title: "Help Marketplace", desc: "Hire local plumbers, electricians, cleaners, and handymen." },
    { icon: <FiMapPin />, title: "OpenStreetMap Proximity", desc: "Find tools and helpers within 5km of your exact location." },
    { icon: <FiMessageSquare />, title: "Real-Time Socket Chat", desc: "Instant messaging with read receipts and location sharing." },
    { icon: <FiDollarSign />, title: "Cash & Pay Later", desc: "No online payment required. Pay cash on tool pickup." },
    { icon: <FiShield />, title: "Admin Moderation", desc: "Built-in review, verification, and dispute resolution." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Platform Features</h1>
        <p className="text-slate-500 mt-2">Everything Neighborly offers to bring communities together.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="p-8 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
              {f.icon}
            </div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">{f.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
