import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const MainLayout = ({children}: {children: React.ReactNode}) => {
    return (
      <>
        <Navbar />
            {children}
        <Footer />
      </>
    )
}

export default MainLayout
