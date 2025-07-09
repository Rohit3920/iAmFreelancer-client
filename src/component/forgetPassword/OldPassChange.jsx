import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function OldPassChange({ user }) {
    const navigate = useNavigate();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New password and confirm password do not match!");
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }

        try {
            const response = await api.put(`/api/auth/change-password/${user._id}`, {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });
            toast.success(response.data.message);
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            navigate("/login")
        } catch (error) {
            console.error("Password change failed:", error);
            toast.error(error.response?.data?.message || "Failed to change password. Please try again.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">
                        Old Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            id="oldPassword"
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                            placeholder="********"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                        <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                        New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                            placeholder="********"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 my-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

export default OldPassChange;