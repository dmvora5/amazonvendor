import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import React from 'react'

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='h-screen flex'>
      <Sidebar />
      <section className="flex h-full flex-1 flex-col">
        <Header />
        <div className="main-content">{children}</div>
      </section>
    </section>
  )
}

export default SuperAdminLayout