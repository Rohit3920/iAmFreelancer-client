import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

function CreateOrder() {
    const { gigId } = useParams();
    const navigate = useNavigate();
    const [gigDetails, setGigDetails] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [isLoadingGig, setIsLoadingGig] = useState(true);
    const [gigError, setGigError] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchGigDetails = async () => {
            if (!gigId) {
                setGigError('No Gig ID provided in the URL.');
                setIsLoadingGig(false);
                return;
            }

            setIsLoadingGig(true);
            setGigError(null);

            try {
                const response = await api.get(`/api/gig/${gigId}`);
                if (response.data) {
                    setGigDetails(response.data);
                } else {
                    setGigError(response.message || 'Failed to fetch gig details.');
                }
            } catch (error) {
                setGigError(`Network error fetching gig details: ${error.message}`);
            } finally {
                setIsLoadingGig(false);
            }
        };

        fetchGigDetails();
    }, [gigId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!gigDetails || gigError) {
            setMessage('Cannot create order: Gig details are not loaded or an error occurred.');
            return;
        }

        setIsLoadingOrder(true);
        setMessage('');

        try {
            const response = await api.post(`/api/orders/${userId}`, {
                gigId: gigDetails._id,
                freelancerId: gigDetails.userId,
            });

            if (response.data && response.data.status === 'success') {
                setMessage(`Order created successfully! Order ID: ${response.data.data.order._id}`);
                setTimeout(() => {
                    navigate('/my-dashboard');
                }, 1000);
            } else {
                let errorMessage = 'Something went wrong while creating the order.';
                if (response.data && typeof response.data.message === 'string') {
                    errorMessage = response.data.message;
                } else if (response.message && typeof response.message === 'string') {
                    errorMessage = response.message;
                }
                setMessage(`Error: ${errorMessage}`);
            }
        } catch (error) {
            setMessage(`Network error: ${error.message}. Please check your connection or API URL.`);
        } finally {
            setIsLoadingOrder(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 font-inter p-4">
            <div className="bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Create New Order</h2>

                {isLoadingGig ? (
                    <div className="flex items-center justify-center text-gray-700">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Loading Gig Details...
                    </div>
                ) : gigError ? (
                    <p className="text-red-600 text-center mb-4">{gigError}</p>
                ) : gigDetails ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-medium text-blue-800">Gig Details:</p>
                            <p className="text-lg font-bold text-gray-900">{gigDetails.title}</p>
                            <p className="text-sm text-gray-700">Price: ${gigDetails.price}</p>
                            <p className="text-sm text-gray-700">Provided by User ID: {gigDetails.userId.id}</p>
                            <p className="text-sm text-gray-700">Gig ID: {gigDetails._id}</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoadingOrder}
                            className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-lg transition duration-300 ease-in-out transform ${isLoadingOrder
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                }`}
                        >
                            {isLoadingOrder ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Creating Order...
                                </div>
                            ) : (
                                'Confirm Order'
                            )}
                        </button>
                    </form>
                ) : (
                    <p className="text-gray-600 text-center">No gig details to display. Please provide a valid Gig ID in the URL.</p>
                )}

                {typeof message === 'string' && message.trim() !== '' && (
                    <p
                        className={`mt-6 text-center text-sm font-medium ${message.startsWith('Error') || message.startsWith('Network') ? 'text-red-600' : 'text-green-600'
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default CreateOrder;
