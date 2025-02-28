import AuthRedirect from '@/components/AuthRedirect';
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

import React from 'react'

const SuperAdminLayout = async ({ children }: { children: React.ReactNode }) => {

  const session: any = await getServerSession(authOptions);

  if (!session) {
    return <AuthRedirect />
  }

  if(!session?.user?.is_superuser) {
    return <AuthRedirect />
  }

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