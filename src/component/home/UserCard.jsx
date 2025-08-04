import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';

function PopularFreelancer({ popularUsers }) {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const userId = localStorage.getItem('userId');
    const [hoveredUser, setHoveredUser] = useState(null);

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

    const handleProfileClick = (id) => {
        navigate(`/view-user-profile/${id}`);
    };

    return (
        <div className="container mx-auto px-4 pb-2">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Top 20 freelancers for working
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
                    {popularUsers?.map((user) => (
                        <div key={user._id}>
                            {user.userRole === 'freelancer' && user._id !== userId && (
                                <div
                                    className="relative flex-shrink-0 cursor-pointer"
                                    onMouseEnter={() => setHoveredUser(user)}
                                    onMouseLeave={() => setHoveredUser(null)}
                                    onClick={() => handleProfileClick(user._id)}
                                >
                                    {/* User Profile Image */}
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-colors duration-200">
                                        <img
                                            src={user.profilePicture || 'https://via.placeholder.com/96'}
                                            alt={user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Hover Details Card */}
                                    {hoveredUser && hoveredUser._id === user._id && (
                                        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-1000 w-64 md:w-80 whitespace-normal transition-opacity duration-300 opacity-100">
                                            <div className="flex items-center mb-2">
                                                <img
                                                    src={user.profilePicture || 'https://via.placeholder.com/40'}
                                                    alt={user.username}
                                                    className="w-10 h-10 rounded-full object-cover mr-3"
                                                />
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{user.username}</h4>
                                                    <p className="text-sm text-gray-500">{user.DomainDetail?.[0]?.freelancerDomain || 'No domain specified'}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-3">
                                                {user.description || 'No description available.'}
                                            </p>
                                            <div className="mt-2 text-sm text-blue-600 hover:underline">
                                                Click to view profile
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PopularFreelancer;