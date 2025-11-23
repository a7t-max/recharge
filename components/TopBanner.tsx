import React from 'react';
import { Flame } from 'lucide-react';

export const TopBanner: React.FC = () => {
  return (
    <a 
      href="https://modderakash.shop/" 
      target="_blank" 
      rel="noreferrer"
      className="block w-full bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs py-2.5 px-4 flex items-center justify-center gap-2 font-bold sticky top-0 z-50 hover:from-red-700 hover:to-orange-700 transition-colors shadow-md"
    >
      <Flame size={14} className="animate-pulse text-yellow-300 fill-yellow-300" />
      <span>modderakash.shop - For More Hack APKs</span>
      <Flame size={14} className="animate-pulse text-yellow-300 fill-yellow-300" />
    </a>
  );
};