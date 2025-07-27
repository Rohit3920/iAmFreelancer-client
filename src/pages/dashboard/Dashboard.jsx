import React, { useEffect, useState } from 'react';
import FreelancerDashboard from './FreelancerDashboard';
import ClientDashboard from './ClientDashboard';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

function Dashboard() {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            toast.error('You need to be logged in to view the dashboard.');
            navigate('/login');
            setLoading(false);
            return;
        }

        const fetchUserRole = async () => {
            try {
                const userRes = await api.get(`/api/auth/${userId}`);
                setUserRole(userRes.data.userRole);
            } catch (err) {
                console.error('Error fetching user role:', err);
                setError('Failed to load user data. Please try again.');
                toast.error('Failed to load dashboard. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, [userId, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center text-lg font-medium text-gray-700">Loading dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center text-lg font-medium text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className='text-center mx-auto'>
            {userRole === 'freelancer' ? (
                <FreelancerDashboard />
            ) : userRole === 'user' ? (
                <ClientDashboard />
            ) : (
                <p className="text-gray-600">User role not recognized.</p>
            )}
        </div>
    );
}

export default Dashboard;