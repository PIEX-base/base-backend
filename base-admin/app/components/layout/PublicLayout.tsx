export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/10">
      {/* Main content sem sidebar */}
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
}
