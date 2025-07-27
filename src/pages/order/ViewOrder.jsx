import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const ViewOrder = () => {
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const orderId = params.id;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.get(`/api/orders/${orderId}`);
                setOrder(response.data.data.order);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        } else {
            setLoading(false);
            setError("No order ID provided.");
        }
    }, [orderId]);

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <svg key={`full-${i}`} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <svg key="half" className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0L6.18 17.068c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292zM10 15.068V2.927c-.3-.921-1.603-.921-1.902 0L6.18 6.219a1 1 0 00-.95.69H1.768c-.969 0-1.371 1.24-.588 1.81l2.8 2.034a1 1 0 00.364 1.118l-1.07 3.292c-.3.921.755 1.688 1.538 1.118l2.8-2.034a1 1 0 001.175 0z" />
                </svg>
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
            );
        }
        return <div className="flex">{stars}</div>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white text-black">
                <p className="text-lg font-semibold">Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800">
                <p className="text-lg font-semibold">Error: {error}</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white text-black">
                <p className="text-lg font-semibold">No order found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white font-inter">
            <div className="bg-white shadow-xl rounded-xl p-8 max-w-4xl w-full border border-gray-200">
                <h1 className="text-4xl font-extrabold text-black mb-8 text-center">Order Details</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Order ID</span>
                        <span className="text-lg font-semibold text-gray-800 break-all">{order._id}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Total Price</span>
                        <span className="text-lg font-semibold text-gray-800">${order.price.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Status</span>
                        <span className={`text-lg font-semibold ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Created At</span>
                        <span className="text-lg font-semibold text-gray-800">
                            {new Date(order.createdAt).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow-inner">
                    <h2 className="text-2xl font-bold text-black mb-4">Client Details</h2>
                    <div className="flex items-center space-x-4">
                        <img
                            src={order.clientId.profilePicture || `https://placehold.co/64x64/E0E0E0/333333?text=Client`}
                            alt="Client Profile"
                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/E0E0E0/333333?text=Client`; }}
                        />
                        <div>
                            <p className="text-xl font-semibold text-gray-800">{order.clientId.username}</p>
                            <p className="text-sm text-gray-600 break-all">ID: {order.clientId._id}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-100 rounded-lg shadow-inner">
                    <h2 className="text-2xl font-bold text-black mb-4">Freelancer & Gig Details</h2>
                    <div className="flex flex-col md:flex-row items-start md:items-stretch space-y-6 md:space-y-0 md:space-x-8">
                        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 flex-shrink-0">
                            <img
                                src={order.freelancerId.profilePicture || `https://placehold.co/96x96/E0E0E0/333333?text=Freelancer`}
                                alt="Freelancer Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 mb-3"
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/96x96/E0E0E0/333333?text=Freelancer`; }}
                            />
                            <p className="text-xl font-semibold text-black text-center">{order.freelancerId.username}</p>
                            <p className="text-sm text-gray-600 break-all text-center">ID: {order.freelancerId._id}</p>
                        </div>

                        <div className="flex-1 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-xl font-bold text-black mb-3">Associated Gig</h3>
                            <div className="flex items-start space-x-4 mb-4">
                                <img
                                    src={order.gigId.cover || `https://placehold.co/128x96/E0E0E0/333333?text=Gig+Cover`}
                                    alt="Gig Cover"
                                    className="w-32 h-24 object-cover rounded-md shadow-sm border border-gray-300 flex-shrink-0"
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/128x96/E0E0E0/333333?text=Gig+Cover`; }}
                                />
                                <div className="flex-1">
                                    <p className="text-lg font-semibold text-gray-800">{order.gigId.title}</p>
                                    <p className="text-sm text-gray-600 mb-1">{order.gigId.shortDesc}</p>
                                    <p className="text-md font-bold text-gray-800">Price: ${order.gigId.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-600 break-all">Gig ID: {order.gigId._id}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <span className="text-md font-medium text-gray-700 mr-2">Ratings:</span>
                                {order.gigId.rating ? renderStars(order.gigId.rating) : <span className="text-gray-500">N/A</span>}
                                {order.gigId.rating && (
                                    <span className="ml-2 text-lg font-semibold text-gray-800">
                                        {order.gigId.rating.toFixed(1)} / 5
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewOrder;