import { useState } from "react";
import { SideNav } from "~/components/layout/SideNav";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4 rounded-lg mx-auto max-w-6xl dark:border-gray-700">
      {children}
    </div>
  );
};

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SideNav
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content */}
      <div className="p-4 sm:ml-64">
        <Container>{children}</Container>
      </div>
    </div>
  );
}
