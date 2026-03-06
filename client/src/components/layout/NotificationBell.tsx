/* src/components/layout/NotificationBell.tsx */

import { useState, useEffect, useRef } from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { useSupermarketStore } from '../../store/supermarketStore';
import { BellIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

export const NotificationBell = () => { 
    const activeSupermarketId = useSupermarketStore((state) => state.activeSupermarketId);
    
    const notifications = useNotificationStore((state) => state.notifications);
    const unreadCount = useNotificationStore((state) => state.unreadCount);
    const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
    const markAsRead = useNotificationStore((state) => state.markAsRead);
    const deleteNotification = useNotificationStore((state) => state.deleteNotification);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close whent it clicks outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // It added fetchNotifications to array of dependencies for fix error by linting
    useEffect(() => {
        if (activeSupermarketId) {
            fetchNotifications(activeSupermarketId);
        }
    }, [activeSupermarketId, fetchNotifications]);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount > 9 ? '+9' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-700">Notificaciones</span>
                        {unreadCount > 0 && (
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">
                                Nuevas
                            </span>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div 
                                    key={n._id} 
                                    className={`group relative p-4 border-b border-gray-50 transition-colors hover:bg-gray-50 ${!n.read ? 'bg-blue-50/40' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        <div className="flex-1">
                                            <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                {n.message}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-400">
                                                {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!n.read && (
                                            <button 
                                                onClick={() => markAsRead(n._id)}
                                                className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline"
                                            >
                                                <CheckIcon className="h-3 w-3" /> Marcar leída
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteNotification(n._id)}
                                            className="text-xs text-red-500 font-medium flex items-center gap-1 hover:underline"
                                        >
                                            <TrashIcon className="h-3 w-3" /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center">
                                <BellIcon className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">No hay notificaciones pendientes</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;