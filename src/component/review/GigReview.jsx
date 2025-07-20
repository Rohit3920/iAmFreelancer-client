import React, { useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

function GigReview({ gigId, userId, orderId, onReviewSubmitted, onClose }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post(`/api/review/${userId}/reviews/${gigId}`, {
                rating,
                comment,
                orderId,
            });
            toast.success('Review submitted successfully!');
            setRating(0);
            setComment('');
            if (onReviewSubmitted) {
                onReviewSubmitted(response.data.data.review);
            }
            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit review.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`cursor-pointer text-3xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(i)}
                >
                    &#9733;
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="fixed inset-0 bg-blue-100 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-lg w-full">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Review</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
                        <div className="flex justify-center items-center space-x-1">
                            {renderStars()}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">Comment:</label>
                        <textarea
                            id="comment"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
                            placeholder="Share your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default GigReview;