import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import DeleteGigButton from '../../component/gig/DeleteGigButton';

function GigList() {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const userId = localStorage.getItem('userId');
    const dropdownRefs = useRef({});

    const fetchGigs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/gig');
            setGigs(response.data);
        } catch (err) {
            console.error('Error fetching gigs:', err);
            setError('Failed to fetch gigs. Please try again.');
            toast.error('Failed to load gigs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGigs();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdownId && dropdownRefs.current[openDropdownId] && !dropdownRefs.current[openDropdownId].contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId]);

    const handleGigDeleted = (deletedGigId) => {
        setGigs(prevGigs => prevGigs.filter(gig => gig._id !== deletedGigId));
        toast.success('Gig deleted successfully!');
        setOpenDropdownId(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center text-lg font-medium text-gray-700">Loading gigs...</div>
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

    return (
        <div className="mx-auto px-6 py-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-semibold text-gray-900">Gigs</h1>
                <div className="flex items-center space-x-3">
                    <Link
                        to="/create-gig"
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                        CREATE A NEW GIG
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Gigs</h2>

                    {gigs.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            You have no gigs yet. <Link to="/create-gig" className="text-blue-600 hover:underline">Create your first gig!</Link>
                        </div>
                    ) : (
                        <div className="h-full">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            GIG
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            IMPRESSIONS
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            CLICKS
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ORDERS
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            CANCELLATIONS
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {gigs.map((gig) => (
                                        gig.userId._id === userId &&
                                        <tr key={gig._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 relative">
                                                        {gig.cover ? (
                                                            <img
                                                                className="h-10 w-10 rounded object-cover"
                                                                src={gig.cover}
                                                                alt={gig.title}
                                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/CCCCCC/666666?text=No+Img'; }}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                                                No Img
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <Link to={`/view-gig/${gig._id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline">
                                                            {gig.shortTitle || gig.title}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                0
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                0
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                0
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                0 %
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(openDropdownId === gig._id ? null : gig._id);
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                >
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>

                                                {openDropdownId === gig._id && (
                                                    <div
                                                        ref={el => dropdownRefs.current[gig._id] = el}
                                                        className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 "
                                                        role="menu"
                                                        aria-orientation="vertical"
                                                        aria-labelledby="menu-button"
                                                    >
                                                        <div className="py-1 border-0" role="none">
                                                            <Link
                                                                to={`/view-gig/${gig._id}`}
                                                                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                                                                role="menuitem"
                                                                onClick={() => setOpenDropdownId(null)}
                                                            >
                                                                View
                                                            </Link>
                                                            <Link
                                                                to={`/update-gig/${gig._id}`}
                                                                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                                                                role="menuitem"
                                                                onClick={() => setOpenDropdownId(null)}
                                                            >
                                                                Edit
                                                            </Link>
                                                            <DeleteGigButton
                                                                gigId={gig._id}
                                                                onGigDeleted={handleGigDeleted}
                                                                btnColor ={"bg-transparent text-gray-700 hover:bg-gray-100"}
                                                                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                                role="menuitem"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GigList;