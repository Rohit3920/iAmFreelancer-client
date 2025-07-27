import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

import PurchasedGigsList from '../../component/dashboard/PurchasedGigsList';
import ChatInterface from '../../component/dashboard/ChatInterface';
import ReviewsSection from '../../component/dashboard/ReviewsSection';

function ClientDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasedGigs, setPurchasedGigs] = useState([]);
    const [conversationsUsers, setConversationsUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const userRes = await api.get(`/api/auth/${userId}`);
                const ordersRes = await api.get(`/api/orders/${userRes.data._id}/${userRes.data.userRole}`);
                setPurchasedGigs(ordersRes.data.data.orders);

                const reviewsRes = await api.get(`/api/review/users/${userId}`);
                setReviews(reviewsRes.data.data.reviews);
            } catch (err) {
                console.error('Error fetching client data:', err);
                setError('Failed to load client dashboard data.');
                toast.error('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        } else {
            setError('User ID not found. Please log in.');
            setLoading(false);
        }
    }, [userId, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center text-lg font-medium text-gray-700">Loading client dashboard...</div>
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
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="col-span-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Purchased Gigs</h2>
                    <PurchasedGigsList gigs={purchasedGigs} />
                </div>
                <div className="col-span-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Chat</h2>
                    <ChatInterface setConversationsUsers={setConversationsUsers} currentUserId={userId} conversationsUsers={conversationsUsers} />
                </div>
                <div className="col-span-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">My Reviews</h2>
                    <ReviewsSection reviews={reviews} />
                </div>
            </div>
        </div>
    );
}

export default ClientDashboard;