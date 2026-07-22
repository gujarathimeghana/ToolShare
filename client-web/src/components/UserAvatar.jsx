import React from 'react';

const AVATAR_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-fuchsia-600',
];

export const UserAvatar = ({ name = 'User', avatarUrl = '', size = 'md', className = '' }) => {
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  // Deterministic color based on name
  let colorIndex = 0;
  for (let i = 0; i < name.length; i++) {
    colorIndex += name.charCodeAt(i);
  }
  const colorGradient = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-extrabold',
    lg: 'w-14 h-14 text-xl font-black',
    xl: 'w-24 h-24 text-3xl font-black',
  }[size] || 'w-10 h-10 text-sm font-extrabold';

  if (avatarUrl && avatarUrl.trim() !== '' && !avatarUrl.includes('photo-1534528741775-53994a69daeb')) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover border-2 border-indigo-500/30 shadow-md ${className}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-tr ${colorGradient} text-white flex items-center justify-center shadow-lg border-2 border-white/20 uppercase tracking-wider ${className}`}
      title={name}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
