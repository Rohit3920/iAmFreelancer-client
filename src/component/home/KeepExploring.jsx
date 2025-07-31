import React, { useRef } from 'react'
import ServiceCard from './ServiceCard';

function KeepExploring({exploringGig}) {

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

        <div className="container mx-auto px-4 py-8 mt-24 md:mt-20 lg:mt-16">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Based on what you might be looking for
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
                    <button className="flex-shrink-0 bg-white p-4 rounded-xl shadow-md flex items-center justify-center h-32 w-48 border border-gray-300 hover:shadow-lg transition duration-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-600 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="text-gray-700 font-medium">Keep exploring</span>
                    </button>

                    {exploringGig?.map((card) => (
                        <ServiceCard key={card._id} gig={card} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default KeepExploring
