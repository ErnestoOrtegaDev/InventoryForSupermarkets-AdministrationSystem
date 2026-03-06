/* src/components/layout/Sidebar.tsx */

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Store, Users, LogOut, X, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import clsx from 'clsx'; 
import Swal from 'sweetalert2';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

// We receive isOpen and setIsOpen, and tell it to use the SidebarProps interface.
export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const { user, logout } = useAuthStore();

    // We define the links. We could hide some depending on the user's role.
    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        
        { to: '/inventory', icon: Package, label: 'Inventario' },

        ...((user?.role === 'admin' || user?.role === 'provider') ? [
            { to: '/supermarkets', icon: Store, label: 'Supermercados' },
        ] : []),

        ...(user?.role === 'admin' ? [
            { to: '/users', icon: Users, label: 'Usuarios' },
        ] : []),

        ...(user?.role === 'admin' || user?.role === 'manager') ? [
            {to: '/history', icon: Clock, label: 'Historial de Movimientos'},
        ] : [],
    ];

    const handleLogout = () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¿Estás seguro que deseas salir del sistema?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)} // Close menu if it clicks outside
                />
            )}

            {/* SIDEBAR */}
            <aside className={clsx(
                "w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50 transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" 
            )}>
                
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <div className="flex items-center">
                        <Store className="text-rose-500 mr-2" size={24} />
                        <span className="font-bold text-lg tracking-wide">StockMaster</span>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navbar */}
                <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsOpen(false)} 
                            className={({ isActive }) => clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium',
                                isActive 
                                    ? 'bg-rose-800 text-white shadow-md' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    );
};