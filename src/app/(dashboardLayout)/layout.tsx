import React from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardSidebar />
      <div className="md:pl-64 min-h-screen flex flex-col pt-16 md:pt-0">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
