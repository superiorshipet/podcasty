import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
    notificationId: number;
    podcastId: number;
    episodeId?: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const NotificationBell: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const [notifs, countRes] = await Promise.all([
                api.notifications.getAll(),
                api.notifications.getUnreadCount()
            ]);
            setNotifications(Array.isArray(notifs) ? notifs : []);
            setUnreadCount(countRes?.count || 0);
        } catch (e) {
            console.error('Failed to fetch notifications:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notif: Notification) => {
        // Mark as read
        if (!notif.isRead) {
            await api.notifications.markAsRead(notif.notificationId);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev =>
                prev.map(n => n.notificationId === notif.notificationId ? { ...n, isRead: true } : n)
            );
        }
        // Navigate to podcast
        setIsOpen(false);
        navigate(`/podcast/${notif.podcastId}`);
    };

    const handleMarkAllAsRead = async () => {
        await api.notifications.markAllAsRead();
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleDeleteNotification = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        await api.notifications.deleteNotification(id);
        setNotifications(prev => prev.filter(n => n.notificationId !== id));
        fetchNotifications();
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="overflow-y-auto max-h-72">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.notificationId}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${!notif.isRead ? 'bg-blue-50' : ''}`}
                                >
                                    {/* Unread indicator */}
                                    <div className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm truncate">{notif.title}</p>
                                        <p className="text-gray-600 text-sm mt-0.5 line-clamp-2">{notif.message}</p>
                                        <p className="text-gray-400 text-xs mt-1">{formatTimeAgo(notif.createdAt)}</p>
                                    </div>

                                    {/* Delete button */}
                                    <button
                                        onClick={(e) => handleDeleteNotification(e, notif.notificationId)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
