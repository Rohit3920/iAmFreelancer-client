import React from 'react';
import { useNavigate } from 'react-router-dom';

function ReviewsSection({ reviews }) {
    const navigate = useNavigate();

    const renderStars = (rating) => {
        if (rating === undefined || rating === null) {
            return <span className="text-gray-500">N/A</span>;
        }
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <svg key={`full-${i}`} className="w-4 h-4 text-yellow-500 inline-block" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <svg key="half" className="w-4 h-4 text-yellow-500 inline-block" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0L6.18 17.068c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292zM10 15.068V2.927c-.3-.921-1.603-.921-1.902 0L6.18 6.219a1 1 0 00-.95.69H1.768c-.969 0-1.371 1.24-.588 1.81l2.8 2.034a1 1 0 00.364 1.118l-1.07 3.292c-.3.921.755 1.688 1.538 1.118l2.8-2.034a1 1 0 001.175 0z" />
                </svg>
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 inline-block" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
            );
        }
        return <div className="flex items-center">{stars} {rating !== undefined && rating !== null && <span className="ml-1 text-xs text-gray-700">({rating.toFixed(1)})</span>}</div>;
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
            {reviews === null || reviews === undefined ? (
                <p className="text-gray-600 text-center py-4">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p className="text-gray-600 text-center py-4">You haven't submitted any reviews yet.</p>
            ) : (
                <>
                    {/* Mobile & Tablet View (list/card layout) */}
                    <div className="block lg:hidden">
                        {reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-200 py-4 last:border-b-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-base font-medium text-gray-900">{review.gigId?.title || 'Unknown Gig'}</div>
                                    <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className="mb-2">
                                    {renderStars(review.rating)}
                                </div>
                                <div className="text-sm text-gray-700 mb-2">{review.comment}</div>
                                <div className="text-xs text-gray-600 mb-3">Author: {review.userId?.username || 'N/A'}</div>
                                <button
                                    onClick={() => { navigate(`/view-gig/${review.gigId._id}`); }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md transition duration-200 shadow-sm text-sm"
                                >
                                    View Gig
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View (table layout) */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Gig Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Review Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Author
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reviews.map((review) => (
                                    <tr key={review._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-left">
                                            <div className="text-sm font-medium text-gray-900">{review.gigId?.title || 'Unknown Gig'}</div>
                                            <div className="text-xs text-gray-500 mt-1">{review.comment}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderStars(review.rating)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{new Date(review.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{review.userId?.username || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                            <button
                                                onClick={() => { navigate(`/view-gig/${review.gigId._id}`); }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 shadow-sm"
                                            >
                                                View Gig
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default ReviewsSection;