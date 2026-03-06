/* src/components/layout/MainLayout.tsx */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react'; 
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = () => {
    // State for control the navbar in mobile resolution
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            
            {/* Sidebar with fotsteps of props to controll */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* MainContent */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0 transition-all duration-300">
                
                {/* Superior Navbar in Mobile Resolution */}
                <div className="lg:hidden flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-1 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-lg text-slate-800">StockMaster</span>
                    </div>
                </div>

                <Header />
                
                <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};