import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { showToast } = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Thank you for contacting us! We will reply shortly.', 'success');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white text-center">Contact Neighborly Support</h1>
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glassmorphism border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Message</label>
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            required
          ></textarea>
        </div>
        <button type="submit" className="w-full py-3 rounded-xl font-bold text-white btn-gradient">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
