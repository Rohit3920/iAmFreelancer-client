import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import ReviewDisplay from './ReviewDisplay';

function ReviewsList({ gigId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/api/gigs/${gigId}/reviews`);
                setReviews(response.data.data.reviews);
            } catch (err) {
                console.error('Error fetching reviews:', err);
                setError('Failed to load reviews.');
            } finally {
                setLoading(false);
            }
        };

        if (gigId) {
            fetchReviews();
        }
    }, [gigId]);

    if (loading) {
        return <div className="text-center py-4">Loading reviews...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">{error}</div>;
    }

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet for this gig.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewDisplay key={review._id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReviewsList;