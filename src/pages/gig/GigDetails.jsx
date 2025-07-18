import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import DeleteGigButton from '../../component/gig/DeleteGigButton';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function GigDetails() {
    const { gigId } = useParams();
    const navigate = useNavigate();
    const [gig, setGig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        const fetchGigDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/gig/${gigId}`);
                setGig(response.data);
            } catch (err) {
                console.error('Error fetching gig details:', err);
                if (err.response && err.response.status === 404) {
                    setError('Gig not found.');
                } else {
                    setError('Failed to fetch gig details. Please try again.');
                }
                toast.error('Failed to load gig details.');
            } finally {
                setLoading(false);
            }
        };

        fetchGigDetails();
    }, [gigId]);

    const handleGigDeleted = () => {
        toast.success('Gig deleted successfully! Redirecting...');
        navigate('/view-gigs');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center text-lg font-medium text-gray-700">Loading gig details...</div>
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

    if (!gig) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center text-lg font-medium text-gray-600">Gig details could not be loaded.</div>
            </div>
        );
    }

    const imagesToDisplay = (gig.images && gig.images.length > 0)
        ? gig.images
        : (gig.cover ? [gig.cover] : []);

    return (
        <div className="container mx-auto px-4 py-10 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-5xl mx-auto border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{gig.title}</h1>
                    {
                        gig.userId._id === userId &&
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to={`/update-gig/${gig._id}`}
                                className="px-5 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                                Update Gig
                            </Link>
                            <DeleteGigButton gigId={gig._id} onGigDeleted={handleGigDeleted} />
                        </div>
                    }
                </div>

                <div className="mb-8">
                    {imagesToDisplay.length > 0 ? (
                        <Carousel
                            showArrows={true}
                            showStatus={false}
                            showIndicators={true}
                            showThumbs={false}
                            infiniteLoop={true}
                            autoPlay={true}
                            interval={1500}
                            transitionTime={500}
                            swipeable={true}
                            emulateTouch={true}
                            stopOnHover={true}
                            className="rounded-lg shadow-xl overflow-hidden border border-gray-200"
                        >
                            {imagesToDisplay.map((image, index) => (
                                <div key={index} className="h-96 w-full flex items-center justify-center bg-gray-100">
                                    <img
                                        src={image}
                                        alt={`Gig Image ${index + 1}`}
                                        className="h-full object-contain max-w-full"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/900x500/E0E0E0/666666?text=Image+Error'; }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    ) : (
                        <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg shadow-md border border-gray-200 text-gray-500 text-lg">
                            No images available for this gig.
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
                        <h3 className="text-2xl font-bold text-blue-800 mb-4 pb-2 border-b border-blue-300">Description</h3>
                        <p className="text-gray-700 leading-relaxed text-base mb-4">{gig.description}</p>
                        <div className="mt-4 pt-4 border-t border-blue-300">
                            <p className="mb-3 text-lg font-bold text-gray-800">
                                Category: <span className="font-semibold text-blue-700">{gig.categoryMain}</span>
                            </p>
                            {gig.categorySub && gig.categorySub.length > 0 && (
                                <>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        {gig.categorySub.map((subCategory, index) => (
                                            <li key={index} className="text-base font-medium">{subCategory}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
                        <h3 className="text-2xl font-bold text-green-800 mb-4 pb-2 border-b border-green-300">Gig Details</h3>
                        <div className="space-y-2 text-gray-700 text-base">
                            <p><strong>Price:</strong> <span className="font-semibold text-green-700">${gig.price}</span></p>
                            <p><strong>Delivery Time:</strong> <span className="font-medium">{gig.deliveryTime} days</span></p>
                            <p><strong>Revisions:</strong> <span className="font-medium">{gig.revisionNumber}</span></p>
                            <p><strong>Rating:</strong>
                                <span className="font-medium ml-1">
                                    {gig.starNumber > 0 ? `${(gig.totalStars / gig.starNumber).toFixed(1)} (${gig.starNumber} reviews)` : 'Not yet rated'}
                                </span>
                            </p>
                            {gig.serviceType && gig.serviceType !== '' && (
                                <p><strong>Service Type:</strong> <span className="font-medium">{gig.serviceType}</span></p>
                            )}
                        </div>
                    </div>
                </div>

                {gig.coreFeatures && gig.coreFeatures.length > 0 && (
                    <div className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-200">
                        <h3 className="text-2xl font-bold text-purple-800 mb-4 pb-2 border-b border-purple-300">Core Features</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
                            {gig.coreFeatures.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <svg className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                    </svg>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {
                    gig.userId?.username && <div className='mt-4 text-gray-400'>
                        <p><strong>Created By:</strong> <span className="font-medium">{gig.userId?.username || 'N/A'}</span></p>
                        <p><Link to={`/profile/${gig.userId?._id}`} className="font-medium cursor-pointer">{gig.userId?.email || 'N/A'}</Link></p>
                    </div>
                }
            </div>
        </div>
    );
}

export default GigDetails;