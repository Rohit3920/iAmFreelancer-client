import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Truck, Star, CircleAlert, Clock, Play, Eye } from 'lucide-react';

function OrderCard({ order, currentUserRole, onStatusChange, onReviewPrompt }) {
    const userId = localStorage.getItem('userId')

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

    // const canTakeAction = () => {
    //     if (currentUserRole === 'freelancer' && userId === order.freelancerId._id) {
    //         return ['pending', 'accepted', 'in progress'].includes(order.status);
    //     }
    //     if (currentUserRole === 'user' && userId === order.clientId._id) {
    //         return ['pending', 'delivered', 'completed'].includes(order.status) && !order.isReviewed;
    //     }
    //     return false;
    // };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-6">
                <Link to={`/view-order/${order._id}`} className="text-blue-600 hover:underline">
                    Ord_{order._id.substring(0, 8)}...
                </Link>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 sm:px-6">
                <Link to={`/view-gig/${order.gigId._id}`} className="text-blue-600 hover:underline">
                    gig_{order.gigId?._id.substring(0, 8) || 'Gig Title Not Available'}...
                </Link>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                {
                    currentUserRole == "freelancer" ?
                        <Link to={`/view-user-profile/${order.clientId._id}`}>
                            <p>{order.clientId?.username || 'N/A'}</p>
                        </Link> : <Link to={`/view-user-profile/${order.freelancerId._id}`}>
                            <p>{order.freelancerId?.username || 'N/A'}</p>
                        </Link>
                }
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                ${order.price.toFixed(2)}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm sm:px-6">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 sm:px-6">
                {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium sm:px-6">
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="relative group">
                            <Link to={`/view-order/${order._id}`} className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100">
                                <Eye className="h-5 w-5 text-blue-500" />
                            </Link>
                            <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">View Order</span>
                        </div>
                    {/* Freelancer Actions */}
                    {currentUserRole === 'freelancer' && userId === order.freelancerId._id && (
                        <>
                            {order.status === 'pending' && (
                                <>
                                    <div className="relative group">
                                        <button onClick={() => handleStatusUpdate('accepted')} className="text-green-600 hover:text-green-900 transition-colors duration-200 p-1 rounded-full hover:bg-green-100">
                                            <Check className="h-5 w-5" />
                                        </button>
                                        <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">Accept</span>
                                    </div>
                                    <div className="relative group">
                                        <button onClick={() => handleStatusUpdate('cancelled')} className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-100">
                                            <X className="h-5 w-5" />
                                        </button>
                                        <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">Decline</span>
                                    </div>
                                </>
                            )}
                            {order.status === 'accepted' && (
                                <div className="relative group">
                                    <button onClick={() => handleStatusUpdate('in progress')} className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-full hover:bg-blue-100">
                                        <Play className="h-5 w-5" />
                                    </button>
                                    <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">Start</span>
                                </div>
                            )}
                            {order.status === 'in progress' && (
                                <div className="relative group">
                                    <button onClick={() => handleStatusUpdate('delivered')} className="text-purple-600 hover:text-purple-900 transition-colors duration-200 p-1 rounded-full hover:bg-purple-100">
                                        <Truck className="h-5 w-5" />
                                    </button>
                                    <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">Deliver</span>
                                </div>
                            )}
                        </>
                    )}

                    {/* Client Actions */}
                    {currentUserRole === 'user' && userId === order.clientId._id && (
                        <>
                            {order.status === 'pending' && (
                                <div className="relative group">
                                    <button onClick={() => handleStatusUpdate('cancelled')} className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-100">
                                        <X className="h-5 w-5" />
                                    </button>
                                    <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">Cancel</span>
                                </div>
                            )}
                            {order.status === 'delivered' && (
                                <>
                                    <div className="relative group">
                                        <button onClick={() => handleStatusUpdate('completed')} className="text-emerald-600 hover:text-emerald-900 transition-colors duration-200 p-1 rounded-full hover:bg-emerald-100">
                                            <Check className="h-5 w-5" />
                                        </button>
                                        <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">Complete</span>
                                    </div>
                                    <div className="relative group">
                                        <button onClick={() => handleStatusUpdate('disputed')} className="text-orange-600 hover:text-orange-900 transition-colors duration-200 p-1 rounded-full hover:bg-orange-100">
                                            <CircleAlert className="h-5 w-5" />
                                        </button>
                                        <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">Dispute</span>
                                    </div>
                                </>
                            )}
                            {(order.status === 'delivered' || order.status === 'completed') && !order.isReviewed && (
                                <div className="relative group">
                                    <button onClick={handleLeaveReview} className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200 p-1 rounded-full hover:bg-yellow-100">
                                        <Star className="h-5 w-5" />
                                    </button>
                                    <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">Review</span>
                                </div>
                            )}
                            {order.status === 'completed' && order.isReviewed && (
                                <span className="text-gray-500 text-xs">Reviewed</span>
                            )}
                        </>
                    )}

                    {/* Default View Order Link for all other cases */}
                    {/* {!canTakeAction() && (
                        <div className="relative group">
                            <Link to={`/view-order/${order._id}`} className="text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100">
                                <Eye className="h-5 w-5 text-blue-500" />
                            </Link>
                            <span className="absolute left-1/2 -top-8 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">View Order</span>
                        </div>
                    )} */}
                </div>
            </td>
        </tr>
    );
}

export default OrderCard;
