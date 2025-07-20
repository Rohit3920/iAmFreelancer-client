import React from 'react';
import { Link } from 'react-router-dom';

function OrderCard({ order, currentUserRole, onStatusChange, onReviewPrompt }) {
    const handleStatusUpdate = (newStatus) => {
        if (onStatusChange) {
            onStatusChange(order._id, newStatus);
        }
    };

    const handleLeaveReview = () => {
        if (onReviewPrompt) {
            onReviewPrompt(order);
        }
    };

    const statusColors = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'accepted': 'bg-blue-100 text-blue-800',
        'in progress': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'completed': 'bg-emerald-100 text-emerald-800',
        'cancelled': 'bg-red-100 text-red-800',
        'disputed': 'bg-orange-100 text-orange-800',
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <Link to={`/view-gig/${order.gigId._id}`} className="text-xl font-bold text-blue-600 hover:underline">
                        {order.gigId?.title || 'Gig Title Not Available'}
                    </Link>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                    <p className="font-medium text-gray-700">Client:</p>
                    <p className="text-gray-800">{order.clientId?.username || 'N/A'}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Freelancer:</p>
                    <p className="text-gray-800">{order.freelancerId?.username || 'N/A'}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Price:</p>
                    <p className="text-gray-800">${order.price.toFixed(2)}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Order Date:</p>
                    <p className="text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                {currentUserRole === 'freelancer' && (
                    <>
                        {order.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => handleStatusUpdate('accepted')}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                                >
                                    Accept Order
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('cancelled')}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                                >
                                    Decline Order
                                </button>
                            </>
                        )}
                        {order.status === 'accepted' && (
                            <button
                                onClick={() => handleStatusUpdate('in progress')}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                            >
                                Mark In Progress
                            </button>
                        )}
                        {order.status === 'in progress' && (
                            <button
                                onClick={() => handleStatusUpdate('delivered')}
                                className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600"
                            >
                                Mark Delivered
                            </button>
                        )}
                    </>
                )}

                {currentUserRole === 'user' && (
                    <>
                        {order.status === 'pending' && (
                            <button
                                onClick={() => handleStatusUpdate('cancelled')}
                                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                            >
                                Cancel Order
                            </button>
                        )}
                        {order.status === 'delivered' && !order.isReviewed && (
                            <>
                                <button
                                    onClick={() => handleStatusUpdate('completed')}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-md text-sm hover:bg-emerald-600"
                                >
                                    Mark Completed
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate('disputed')}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
                                >
                                    Dispute Order
                                </button>
                                <button
                                    onClick={handleLeaveReview}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                                >
                                    Review
                                </button>

                            </>
                        )}
                        {order.status === 'completed' && order.isReviewed && (
                            <span className="text-gray-500 text-sm">Reviewed</span>
                        )}
                        {order.status === 'completed' && !order.isReviewed && (
                            <button
                                onClick={handleLeaveReview}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                            >
                                Review
                            </button>
                        )}
                    </>
                )}
            </div>
            <p className="text-gray-600 text-sm mt-1">Order ID: {order._id}</p>
        </div>
    );
}

export default OrderCard;