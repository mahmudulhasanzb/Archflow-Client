import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <DashboardSidebar />
      <div className="pl-64 min-h-screen flex flex-col">{children}</div>
    </div>
  );
};

export default DashboardLayout;
