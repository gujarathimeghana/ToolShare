import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <h1 className="text-4xl font-black text-slate-900 dark:text-white">About Neighborly</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        Neighborly was born out of a simple realization: millions of households purchase expensive power tools, pressure washers, and ladders that sit unused in garages 99% of the time. Meanwhile, neighbors next door need those exact tools for a weekend project.
      </p>
      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        Our mission is to foster tight-knit, resilient local communities through hyper-local tool sharing and skill exchange. By connecting neighbors directly, we help families save money, reduce plastic and industrial waste, and rebuild authentic neighborhood trust.
      </p>
    </div>
  );
};

export default AboutPage;
