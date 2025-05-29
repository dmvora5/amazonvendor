import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button'
import { SidebarProvider } from '@/components/ui/sidebar';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'



const SuperAdminLayout = async ({ children }: { children: React.ReactNode }) => {

    const session: any = await getServerSession(authOptions);


    if (!session?.user) {
        redirect(`${process.env.NEXT_PUBLIC_APP_URL}`)
    }

    // const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
    // const [isSubmenuOpen, setIsSubmenuOpen] = useState(false); // Submenu toggle state

    // const toggleSubmenu = () => setIsSubmenuOpen(!isSubmenuOpen);
    // return (
    //     <div className="h-screen flex flex-col">
    //         {/* Navbar */}
    //         <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
    //             <h1 className="text-xl">Your Application</h1>
    //             {/* Sidebar Toggle Button (Collapse/Expand) */}
    //             <Button
    //                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    //                 className="bg-gray-600 hover:bg-gray-700"
    //             >
    //                 {isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
    //             </Button>
    //         </header>

    //         <div className="flex flex-1">
    //             {/* Sidebar */}
    //             <SidebarProvider>
    //                 <AppSidebar />
    //             </SidebarProvider>

    //             {/* Main content area */}
    //            {children}
    //         </div>
    //     </div>
    // )
    return (
        <SidebarProvider>
            <div className='w-full'>
                <Header />
                <div className='flex min-h-screen pt-[4rem]'>
                    <AppSidebar session={session} />
                    <main className="flex-1 overflow-y-auto bg-gray-200 p-5 relative">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )


}

export default SuperAdminLayout