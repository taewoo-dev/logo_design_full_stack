import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'line' | 'pill';
}

export const Tabs = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'line',
}: TabsProps) => {
  const activeTabId = activeTab || tabs[0]?.id;

  const variantStyles = {
    line: {
      list: 'border-b border-gray-200',
      tab: (isActive: boolean) =>
        twMerge(
          'py-4 px-1 border-b-2 font-medium text-sm cursor-pointer',
          isActive
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ),
    },
    pill: {
      list: 'bg-gray-100 p-1 rounded-lg',
      tab: (isActive: boolean) =>
        twMerge(
          'px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors',
          isActive
            ? 'bg-white text-gray-900 shadow'
            : 'text-gray-500 hover:text-gray-900'
        ),
    },
  };

  return (
    <div className={className}>
      <div className="sm:hidden">
        <select
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          value={activeTabId}
          onChange={(e) => onChange(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className={variantStyles[variant].list}>
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  className={variantStyles[variant].tab(isActive)}
                  onClick={() => onChange(tab.id)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${tab.id}-panel`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${tab.id}-panel`}
            className={tab.id === activeTabId ? '' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}; 