import React from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
        <DashboardSidebar />
        <div>
            {children}
        </div>
    </>
  )
}

export default DashboardLayout
