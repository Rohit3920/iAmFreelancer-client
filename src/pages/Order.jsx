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
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const userId = localStorage.getItem('userId');

    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const fetchOrders = useCallback(debounce(async (currentUserId, userRole, query = '', status = 'all') => {
        setLoading(true);
        try {
            const searchParams = new URLSearchParams();
            if (userRole === 'user') {
                searchParams.append('clientId', currentUserId);
            } else if (userRole === 'freelancer') {
                searchParams.append('freelancerId', currentUserId);
            }

            if (query) {
                searchParams.append('q', query);
            }
            if (status !== 'all') {
                searchParams.append('status', status);
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
                fetchOrders(userRes.data._id, userRes.data.userRole, searchTerm, statusFilter);
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
    }, [userId, fetchOrders, searchTerm, statusFilter]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleSortRequest = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedOrders = [...orders].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/api/orders/${currentUser.userRole}/${orderId}`, { status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
                )
            );
            toast.success(`Order status updated to "${newStatus}"!`);

            if (newStatus === 'completed' && currentUser.userRole === 'user') {
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

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
        }
        return null;
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className="text-4xl font-semibold text-gray-900 mb-4 md:mb-0 text-center md:text-left w-full md:w-auto">
                    My Orders
                </h1>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                    <div className="relative flex items-center w-full md:w-64">
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
                    <div className="relative w-full md:w-48">
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="in progress">In Progress</option>
                            <option value="delivered">Delivered</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="disputed">Disputed</option>
                        </select>
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
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none sm:px-6"
                                    onClick={() => handleSortRequest('_id')}
                                >
                                    Order ID {getSortIndicator('_id')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none sm:px-6"
                                    onClick={() => handleSortRequest('gigId.title')}
                                >
                                    Gig Title {getSortIndicator('gigId.title')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none sm:px-6"
                                    onClick={() => handleSortRequest(currentUser.userRole === 'freelancer' ? 'clientId.username' : 'freelancerId.username')}
                                >
                                    {currentUser.userRole === "freelancer" ? 'Client' : 'Freelancer'}
                                    {getSortIndicator(currentUser.userRole === 'freelancer' ? 'clientId.username' : 'freelancerId.username')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none sm:px-6"
                                    onClick={() => handleSortRequest('price')}
                                >
                                    Price {getSortIndicator('price')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none sm:px-6"
                                    onClick={() => handleSortRequest('status')}
                                >
                                    Status {getSortIndicator('status')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none sm:px-6"
                                    onClick={() => handleSortRequest('createdAt')}
                                >
                                    Order Date {getSortIndicator('createdAt')}
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedOrders.map((order) => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    currentUserRole={currentUser.userRole}
                                    currentUser={currentUser}
                                    onStatusChange={handleStatusChange}
                                    onReviewPrompt={handleReviewPrompt}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Order;
