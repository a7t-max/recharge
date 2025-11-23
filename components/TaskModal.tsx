import React from 'react';

interface TaskModalProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({ children, icon, title, subtitle }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-[fadeIn_0.3s_ease-out]">
        <div className="p-6 flex flex-col items-center text-center">
          {/* Close X (Fake) */}
          <div className="absolute top-4 right-4 text-gray-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </div>

          {icon && (
            <div className="mb-4 p-4 bg-blue-50 rounded-full flex items-center justify-center">
              {icon}
            </div>
          )}
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600 mb-6">{subtitle}</p>}
          
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
