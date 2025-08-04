import React, { useRef } from 'react';
import ServiceCard from './ServiceCard';

function TopGigs({ popularGig }) {
    const scrollContainerRef = useRef(null);

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
        <div className="container mx-auto px-4 z-0">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Top most gigs in freelancer
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
                    className="flex items-center space-x-4 overflow-x-scroll pb-4 scrollbar-x-hide scrollbar-hide"
                >
                    {popularGig?.map((card) => (
                        <ServiceCard key={card._id} gig={card} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TopGigs;