import React from 'react';
import { FiFileText, FiCheckSquare, FiUsers, FiFile, FiInfo } from 'react-icons/fi';

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'details', icon: FiInfo, label: 'Details' },
    { id: 'notes', icon: FiFileText, label: 'Notes' },
    { id: 'care', icon: FiCheckSquare, label: 'Care' },
    { id: 'contacts', icon: FiUsers, label: 'Contacts' },
    { id: 'docs', icon: FiFile, label: 'Docs' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === tab.id ? 'text-primary-600' : 'text-gray-500'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;