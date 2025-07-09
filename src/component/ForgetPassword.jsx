import React, { useState } from 'react';
import { toast } from 'react-toastify';
import OldPassChange from './forgetPassword/oldPassChange';
import api from '../utils/api';

function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [userData, setUserData] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email) {
            toast.error('Please enter your email address.');
            setLoading(false);
            return;
        }

        try {

            const response = await api.get(`/api/auth/forgetpassword/${email}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

            const data = response.data;
            setUserData(data.user)
            if (response.status >= 200 && response.status < 300) {
                toast.success(data.message || 'Password reset link sent to your email!');
                setEmail('');
            } else {
                toast.error(data.message || 'Failed to send password reset link. Please try again.');
            }
        } catch (error) {
            console.error('Error sending password reset request:', error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Forgot Password</h2>
            <p className="text-gray-600 text-center mb-6">
                Enter your email address and we'll send you a link to reset your password.
            </p>
            {
                !userData &&
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                            placeholder="your@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Enter'}
                        </button>
                    </div>
                </form>
            }

            {userData && <OldPassChange user={userData} />}
        </div>
    );
}

export default ForgetPassword;