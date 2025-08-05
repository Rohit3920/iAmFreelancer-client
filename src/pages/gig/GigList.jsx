import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import DeleteGigButton from '../../component/gig/DeleteGigButton';
import { Search } from 'lucide-react';

function GigList() {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const loginUserId = localStorage.getItem('userId');
    const dropdownRefs = useRef({});
    const { userId } = useParams();

    const fetchGigs = useCallback(async (query = '') => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ userId });
            if (query) params.append('q', query);
            const { data } = await api.get(`/api/search/gigs?${params}`);
            setGigs(data.data?.gigs || []);
        } catch (err) {
            console.error('Error fetching gigs:', err);
            setError('Failed to fetch gigs. Please try again.');
            toast.error('Failed to load gigs.');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchGigs(searchTerm);
    }, [fetchGigs, userId]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchGigs(searchTerm);
        }, 400);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchGigs]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdownId && dropdownRefs.current[openDropdownId] &&
                !dropdownRefs.current[openDropdownId].contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdownId]);

    const handleGigDeleted = (deletedGigId) => {
        setGigs(prev => prev.filter(gig => gig._id !== deletedGigId));
        toast.success('Gig deleted successfully!');
        setOpenDropdownId(null);
    };

    return (
        <div className="mx-auto px-4 sm:px-6 py-6 bg-gray-100 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">Gigs</h1>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex items-center w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search your gigs..."
                            className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    {userId === loginUserId && (
                        <Link
                            to="/create-gig"
                            className="px-4 sm:px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200 text-center"
                        >
                            CREATE A NEW GIG
                        </Link>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="px-4 sm:px-6 py-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-600">Loading gigs...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">{error}</div>
                    ) : gigs.length === 0 ? (
                        <div className="text-center py-8 text-gray-600">
                            {searchTerm ? (
                                <>No gigs found matching <span className="font-semibold">"{searchTerm}"</span>.</>
                            ) : (
                                <>
                                    You have no gigs yet.
                                    {userId === loginUserId && (
                                        <Link to="/create-gig" className="text-blue-600 hover:underline ml-1">
                                            Create your first gig!
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {['GIG', 'IMPRESSIONS', 'CLICKS', 'ORDERS', 'CANCELLATIONS', ''].map((col, idx) => (
                                                <th
                                                    key={idx}
                                                    scope="col"
                                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col === '' ? 'sr-only' : ''}`}
                                                >
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {gigs.map((gig) => (
                                            <tr key={gig._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                                                    <img
                                                        className="h-10 w-10 rounded object-cover"
                                                        src={gig.cover || 'https://placehold.co/40x40/CCCCCC/666666?text=No+Img'}
                                                        alt={gig.title}
                                                        onError={(e) => { e.target.src = 'https://placehold.co/40x40/CCCCCC/666666?text=No+Img'; }}
                                                    />
                                                    <Link
                                                        to={`/view-gig/${gig._id}`}
                                                        className="ml-4 text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline"
                                                    >
                                                        {gig.shortTitle || gig.title}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">0</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">0</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">0</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">0%</td>
                                                {userId === loginUserId && (
                                                    <td className="px-6 py-4 text-right text-sm font-medium relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDropdownId(openDropdownId === gig._id ? null : gig._id);
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                        >
                                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                        </button>
                                                        {openDropdownId === gig._id && (
                                                            <div
                                                                ref={el => (dropdownRefs.current[gig._id] = el)}
                                                                className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white z-20"
                                                            >
                                                                <div className="py-1">
                                                                    <Link
                                                                        to={`/view-gig/${gig._id}`}
                                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        onClick={() => setOpenDropdownId(null)}
                                                                    >
                                                                        View
                                                                    </Link>
                                                                    <Link
                                                                        to={`/update-gig/${gig._id}`}
                                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        onClick={() => setOpenDropdownId(null)}
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <DeleteGigButton
                                                                        gigId={gig._id}
                                                                        onGigDeleted={handleGigDeleted}
                                                                        btnColor="bg-transparent text-gray-700 hover:bg-gray-100"
                                                                        className="block w-full text-left px-4 py-2 text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="grid md:hidden gap-4">
                                {gigs.map((gig) => (
                                    <div key={gig._id} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col sm:flex-row justify-between">
                                        <div className="flex items-center">
                                            <img
                                                className="h-12 w-12 rounded object-cover"
                                                src={gig.cover || 'https://placehold.co/40x40/CCCCCC/666666?text=No+Img'}
                                                alt={gig.title}
                                                onError={(e) => { e.target.src = 'https://placehold.co/40x40/CCCCCC/666666?text=No+Img'; }}
                                            />
                                            <div className="ml-3">
                                                <Link to={`/view-gig/${gig._id}`} className="font-medium text-gray-900 hover:text-blue-600 hover:underline">
                                                    {gig.shortTitle || gig.title}
                                                </Link>
                                                <p className="text-xs text-gray-500">0 impressions • 0 clicks • 0 orders</p>
                                            </div>
                                        </div>
                                        {userId === loginUserId && (
                                            <div className="mt-3 sm:mt-0 relative self-end">
                                                <button
                                                    onClick={() => setOpenDropdownId(openDropdownId === gig._id ? null : gig._id)}
                                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                                >
                                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>
                                                {openDropdownId === gig._id && (
                                                    <div
                                                        ref={el => (dropdownRefs.current[gig._id] = el)}
                                                        className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white z-20"
                                                    >
                                                        <div className="py-1">
                                                            <Link to={`/view-gig/${gig._id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setOpenDropdownId(null)}>View</Link>
                                                            <Link to={`/update-gig/${gig._id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setOpenDropdownId(null)}>Edit</Link>
                                                            <DeleteGigButton
                                                                gigId={gig._id}
                                                                onGigDeleted={handleGigDeleted}
                                                                btnColor="bg-transparent text-gray-700 hover:bg-gray-100"
                                                                className="block w-full text-left px-4 py-2 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GigList;
