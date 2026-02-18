import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');

        // Calculate password strength for new password
        if (name === 'newPassword') {
            let strength = 0;
            if (value.length >= 6) strength++;
            if (value.length >= 10) strength++;
            if (/[A-Z]/.test(value)) strength++;
            if (/[0-9]/.test(value)) strength++;
            if (/[^A-Za-z0-9]/.test(value)) strength++;
            setPasswordStrength(strength);
        }
    };

    const validateForm = () => {
        if (!formData.currentPassword) {
            setError('Current password is required');
            return false;
        }
        if (formData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return false;
        }
        if (formData.currentPassword === formData.newPassword) {
            setError('New password must be different from current password');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            // Get credentials for Basic Auth
            const credentials = JSON.parse(localStorage.getItem('credentials'));
            const token = btoa(`${credentials.email}:${credentials.password}`);

            // UPDATED API CALL
            const response = await axios.put(
                'http://localhost:8080/user/change-password',  // Changed URL
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                },
                {
                    headers: {
                        'Authorization': `Basic ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Check success
            if (response.data.success) {
                setSuccess(true);

                // Update stored credentials with new password
                const newCredentials = {
                    email: credentials.email,
                    password: formData.newPassword,
                };
                localStorage.setItem('credentials', JSON.stringify(newCredentials));

                // Close modal after 2 seconds
                setTimeout(() => {
                    handleReset();
                    onClose();
                }, 2000);
            } else {
                setError(response.data.message || 'Failed to change password');
            }
        } catch (err) {
            console.error('Change password error:', err);
            setError(err.response?.data?.message || 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setError('');
        setSuccess(false);
        setPasswordStrength(0);
    };

    const handleCancel = () => {
        handleReset();
        onClose();
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return 'bg-red-500';
        if (passwordStrength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return 'Too Weak';
        if (passwordStrength <= 1) return 'Weak';
        if (passwordStrength <= 3) return 'Medium';
        return 'Strong';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-gray-600 to-gray-900 rounded-3xl blur-lg opacity-30"></div>

                {/* Modal Content */}
                <div className="relative bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-900 via-gray-600 to-blue-800 text-white px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Lock size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Change Password</h2>
                                    <p className="text-white/80 text-sm">Update your account password</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors bgColor"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                                <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                                <div>
                                    <p className="font-semibold text-green-800">Password Changed Successfully!</p>
                                    <p className="text-sm text-green-600">Closing modal...</p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                                <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                                <p className="text-red-600 font-medium text-sm">{error}</p>
                            </div>
                        )}

                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">
                                Current Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                </div>
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={success}
                                    className="w-full pl-12 pr-12 py-3.5 bg-black border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-400 placeholder-gray-400 disabled:opacity-50"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                    disabled={success}
                                >
                                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">
                                New Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                </div>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={success}
                                    className="w-full pl-12 pr-12 py-3.5 bg-black border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-400 placeholder-gray-400 disabled:opacity-50"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                    disabled={success}
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.newPassword && (
                                <div className="mt-3">
                                    <div className="flex gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-2 flex-1 rounded-full transition-all ${i < passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                                                    }`}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-gray-600">
                                            Strength: <span className={
                                                passwordStrength <= 1 ? 'text-red-500' :
                                                    passwordStrength <= 3 ? 'text-yellow-500' :
                                                        'text-green-500'
                                            }>
                                                {getPasswordStrengthText()}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Min. 6 characters
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-500 mb-2">
                                Confirm New Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={success}
                                    className="w-full pl-12 pr-12 py-3.5 bg-black border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-400 placeholder-gray-400 disabled:opacity-50"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                    disabled={success}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    Passwords do not match
                                </p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-black border-2 border-blue-200 rounded-xl p-4">
                            <p className="text-sm font-semibold text-blue-700 mb-2">Password Requirements:</p>
                            <ul className="space-y-1 text-xs text-blue-600">
                                <li className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    At least 6 characters
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    Contains uppercase letter
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    Contains number
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    Contains special character
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={loading || success}
                                className="flex-1 px-6 py-3.5 bgColor text-gray-400 rounded-xl hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 px-6 py-3.5 border-2 bgColor border-gray-300 text-gray-400 rounded-xl hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-gray-600 to-gray-900 text-white rounded-xl hover:from-gray-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader className="animate-spin" size={20} />
                                        Updating...
                                    </span>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;