import React from 'react';

function ReviewDisplay({ review }) {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                    &#9733;
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <div className="flex items-center mb-2">
                <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {review.userId?.profilePicture ? (
                        <img src={review.userId.profilePicture} alt={review.userId.username} className="h-full w-full object-cover" />
                    ) : (
                        review.userId?.username?.charAt(0).toUpperCase() || '?'
                    )}
                </div>
                <div className="ml-3">
                    <p className="font-semibold text-gray-800">{review.userId?.username || 'Anonymous User'}</p>
                    <div className="flex">{renderStars(review.rating)}</div>
                </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            <p className="text-xs text-gray-500 mt-2">
                Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
}

export default ReviewDisplay;