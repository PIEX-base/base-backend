import React, { useState } from "react";

export interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface CardNavTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export const CardNavTabs: React.FC<CardNavTabsProps> = ({
  tabs,
  defaultTab,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
        {tabs.map((tab) => (
          <li key={tab.key} className="me-2">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={tab.key}
              className={`inline-block p-4 rounded-ss-lg transition-colors ${
                activeTab === tab.key
                  ? "text-blue-600 dark:text-blue-500 bg-white dark:bg-gray-800"
                  : "hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div>
        {tabs.map((tab) =>
          activeTab === tab.key ? (
            <div
              key={tab.key}
              id={tab.key}
              role="tabpanel"
              aria-labelledby={`${tab.key}-tab`}
              className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800">
              {tab.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
