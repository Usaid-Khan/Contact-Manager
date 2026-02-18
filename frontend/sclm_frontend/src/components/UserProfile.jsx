import React, { useState, useEffect } from 'react';
import {
    User, Mail, Phone, Lock, LogOut, Edit2, Calendar,
    Shield, CheckCircle, X, Eye, EyeOff, Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import axios from 'axios';
import ChangePasswordModal from './ChangePasswordModal';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);

            // Try to get cached user first
            const cachedUser = authService.getCurrentUser();
            if (cachedUser) {
                setUser(cachedUser);
            }

            // Fetch fresh data from backend
            try {
                const freshUser = await authService.fetchUserProfile();
                if (freshUser) {
                    setUser(freshUser);
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <Loader className="animate-spin text-violet-600" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-500 to-gray-800 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <div className="relative backdrop-blur-xl bg-gray-400 shadow-lg border-b border-gray-300/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/contacts')}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors bgColor"
                            >
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-gray-600 to-gray-900 bg-clip-text text-transparent pb-2">
                                My Profile
                            </h1>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-700 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-blue-900 transition-all shadow-lg hover:shadow-xl font-semibold"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-gray-600 to-gray-900 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                            <div className="relative bg-gray-900 rounded-3xl shadow-2xl p-8">
                                {/* Avatar */}
                                <div className="text-center mb-6">
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 rounded-full blur-xl opacity-50"></div>
                                        <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-2xl">
                                            <span className="text-5xl font-bold text-white">
                                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                            <CheckCircle size={20} className="text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="text-center space-y-2 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-500">
                                        {user?.email?.split('@')[0] || 'User'}
                                    </h2>
                                    <p className="text-gray-400 text-sm">Member Account</p>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-gray-200 to-blue-200 rounded-2xl p-4 text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {user?.contactCount || 0}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Contacts</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-200 to-blue-200 rounded-2xl p-4 text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            <Shield size={24} className="inline" />
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">Verified</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowChangePasswordModal(true)}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-500 transition-all shadow-lg hover:shadow-xl font-semibold group"
                                    >
                                        <Lock size={20} className="group-hover:rotate-12 transition-transform" />
                                        Change Password
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-500 transition-all shadow-lg hover:shadow-xl font-semibold group"
                                    >
                                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information Card */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-700 via-gray-600 to-gray-900 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                            <div className="relative bg-gray-900 rounded-3xl shadow-2xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-500 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl flex items-center justify-center">
                                            <User size={20} className="text-white" />
                                        </div>
                                        Personal Information
                                    </h3>
                                    {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Edit2 size={20} className="text-gray-400" />
                                    </button> */}
                                </div>

                                <div className="space-y-4">
                                    {/* Email */}
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-300 to-gray-300 rounded-2xl hover:shadow-md transition-shadow">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                                            <Mail size={20} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Email Address</p>
                                            <p className="text-lg font-semibold text-gray-800">{user?.email || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-300 to-gray-300 rounded-2xl hover:shadow-md transition-shadow">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                                            <Phone size={20} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Phone Number</p>
                                            <p className="text-lg font-semibold text-gray-800">
                                                {user?.phoneNumber || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* User ID */}
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-300 to-gray-300 rounded-2xl hover:shadow-md transition-shadow">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                                            <Shield size={20} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-semibold uppercase">User ID</p>
                                            <p className="text-lg font-semibold text-gray-800">#{user?.userId || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Security Card */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-gray-600 to-gray-900 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                            <div className="relative bg-gray-900 rounded-3xl shadow-2xl p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                        <Shield size={20} className="text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-500">Account Security</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-300 to-blue-300 rounded-2xl border-2 border-green-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                                <CheckCircle size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">Email Verified</p>
                                                <p className="text-sm text-gray-600">Your email is verified</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-300 to-blue-300 rounded-2xl border-2 border-violet-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center">
                                                <Lock size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">Password Protected</p>
                                                <p className="text-sm text-gray-600">Last changed recently</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowChangePasswordModal(true)}
                                            className="px-4 py-2 bgColor text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showChangePasswordModal && (
                <ChangePasswordModal
                    isOpen={showChangePasswordModal}
                    onClose={() => setShowChangePasswordModal(false)}
                />
            )}

            {/* CSS Animations */}
            <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
};

export default UserProfile;