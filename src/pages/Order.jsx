import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import OrderCard from '../component/OrderCard';
import GigReview from '../component/review/GigReview';
import { Search } from 'lucide-react';

function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const userId = localStorage.getItem('userId');

    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const fetchOrders = useCallback(debounce(async (currentUserId, userRole, query = '') => {
        setLoading(true);
        try {
            const searchParams = new URLSearchParams();
            if (userRole === 'client') {
                searchParams.append('clientId', currentUserId);
            } else if (userRole === 'freelancer') {
                searchParams.append('freelancerId', currentUserId);
            }

            if (query) {
                searchParams.append('q', query);
            }
            
            const ordersRes = await api.get(`/api/search/orders?${searchParams.toString()}`);
            setOrders(ordersRes.data.data.orders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders.');
            toast.error('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    }, 300), []);
    useEffect(() => {
        const fetchUserAndOrders = async () => {
            setLoading(true);
            try {
                const userRes = await api.get(`/api/auth/${userId}`);
                setCurrentUser(userRes.data);
                fetchOrders(userRes.data._id, userRes.data.userRole, searchTerm);
            } catch (err) {
                console.error('Error fetching user data or initial orders:', err);
                setError('Failed to load user or order data.');
                toast.error('Failed to load user or order data.');
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserAndOrders();
        } else {
            setLoading(false);
            setError('User ID not found. Please log in.');
            toast.error('User not authenticated.');
        }
    }, [userId, fetchOrders, searchTerm]); 
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

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

    if (!currentUser) {
        return <div className="text-center text-red-500 py-4">User not authenticated.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-semibold text-gray-900">
                    My Orders
                </h1>
                <div className="relative flex items-center w-full max-w-sm ml-4">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-500"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

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

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-center text-lg font-medium text-gray-700">Loading orders...</div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-center text-lg font-medium text-red-600">{error}</div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-600 text-lg">
                    No orders found for your role or matching your search.
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