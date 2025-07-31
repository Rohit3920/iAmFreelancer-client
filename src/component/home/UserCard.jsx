import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
    const { profilePicture, username, email, DomainDetail } = user;

    const freelancerDomain = DomainDetail && DomainDetail.length > 0
        ? DomainDetail[0].freelancerDomain
        : 'N/A';
    return (
        <div className="flex-shrink-0 w-64 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition duration-200 p-4">
            <div className="flex flex-col items-center text-center">
                <img
                    src={profilePicture || 'https://placehold.co/100x100/CCCCCC/000000?text=User'}
                    alt={username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 mb-4"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/CCCCCC/000000?text=User'; }}
                />
                <Link to={`/view-user-profile/${user._id}`} className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition duration-200 truncate w-full px-2">
                    {username}
                </Link>
                <p className="text-sm text-gray-500 mb-2 truncate w-full px-2">
                    {email}
                </p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {freelancerDomain}
                </span>
            </div>
        </div>
    );
};

export default UserCard;