import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import OrderCard from '../component/OrderCard';
import GigReview from '../component/review/GigReview';

function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchOrdersAndUser = async () => {
            setLoading(true);
            try {
                const userRes = await api.get(`/api/auth/${userId}`);
                setCurrentUser(userRes.data);

                const ordersRes = await api.get(`/api/orders/${userRes.data._id}/${userRes.data.userRole}`);
                console.log(ordersRes.data.data.orders);
                setOrders(ordersRes.data.data.orders);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load orders or user data.');
                toast.error('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrdersAndUser();
    }, [userId]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/api/orders/${currentUser.userRole}/${orderId}`, { status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
                )
            );
            toast.success(`Order status updated to "${newStatus}"!`);

            if (newStatus === 'completed' && currentUser.userRole === 'client') {
                const updatedOrder = orders.find(order => order._id === orderId);
                if (updatedOrder && !updatedOrder.isReviewed) {
                    setSelectedOrderForReview(updatedOrder);
                    setShowReviewForm(true);
                }
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update order status.';
            toast.error(errorMessage);
        }
    };

    const handleReviewPrompt = (order) => {
        setSelectedOrderForReview(order);
        setShowReviewForm(true);
    };

    const handleReviewSubmitted = (reviewData) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order._id === selectedOrderForReview._id ? { ...order, isReviewed: true } : order
            )
        );
        console.log(reviewData);
        setShowReviewForm(false);
        setSelectedOrderForReview(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center text-lg font-medium text-gray-700">Loading orders...</div>
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

    if (!currentUser) {
        return <div className="text-center text-red-500 py-4">User not authenticated.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-4xl font-semibold text-gray-900 mb-8">
                My Orders
            </h1>

            {showReviewForm && selectedOrderForReview && (
                <div className='size-full bg-blue-200'>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                        <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-lg w-full">
                            <GigReview
                                userId={userId}
                                onClose={() => setShowReviewForm(false)}
                                gigId={selectedOrderForReview.gigId._id}
                                orderId={selectedOrderForReview._id}
                                onReviewSubmitted={handleReviewSubmitted}
                            />
                        </div>
                    </div>
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-600 text-lg">
                    No orders found for your role.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            currentUserRole={currentUser.userRole}
                            onStatusChange={handleStatusChange}
                            onReviewPrompt={handleReviewPrompt}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Order;