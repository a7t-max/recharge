import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <div className="bg-gray-50 pt-4 pb-2 px-4 flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className="p-2 -ml-2 text-blue-700 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};
