import React from "react";

interface PageContainerProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageContainer = ({
  title,
  children,
  actions,
}: PageContainerProps) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {actions}
    </div>
    <div>{children}</div>
  </div>
);
