import React, { useEffect, useRef, useState } from 'react';
import api from '../../utils/api';
import ServiceCard from '../../component/home/ServiceCard';
import { useNavigate } from 'react-router-dom';

function MyLikedGig() {
    const [myLikedGigs, setMyLikedGigs] = useState([]);
    const userId = localStorage.getItem('userId');
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMyLikedGigs() {
            try {
                const res = await api.get(`api/like/liked-gigs/${userId}`);
                setMyLikedGigs(res.data);
                if (res.data.length === 0) {
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching liked gigs:", error);
                navigate('/');
            }
        }
        if (userId) {
            fetchMyLikedGigs();
        } else {
            navigate('/');
        }
    }, [userId, navigate]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-24 md:mt-20 lg:mt-16">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        My liked gigs
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={scrollLeft}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={scrollRight}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex items-center space-x-4 overflow-x-scroll pb-4 scrollbar-x-hide"
                >
                    {myLikedGigs.length > 0 ? (
                        myLikedGigs.map((card) => (
                            <ServiceCard key={card._id} gig={card} />
                        ))
                    ) : (
                        <p className="text-gray-600 text-lg">You haven't liked any gigs yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyLikedGig;