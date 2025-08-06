import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Heart } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChevronDown = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className={className}
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRefs = useRef({});
    const profileDropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation(); // Hook to get the current location object
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef(null);
    const searchResultsRef = useRef(null);

    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const performUniversalSearch = useCallback(debounce(async (query) => {
        if (query.length === 0) {
            setSearchResults(null);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            const res = await api.get(`/api/search/universal?q=${query}`);
            const filteredUsers = res.data.data.users.filter(u => u.userRole === 'freelancer');
            const currentUserId = localStorage.getItem('userId');
            const filteredOrders = res.data.data.orders.filter(order =>
                order.clientId?._id === currentUserId || order.freelancerId?._id === currentUserId
            );

            setSearchResults({
                gigs: res.data.data.gigs,
                orders: filteredOrders,
                users: filteredUsers
            });
        } catch (error) {
            console.error('Error during universal search:', error);
            setSearchResults(null);
            toast.error('Failed to fetch search results.');
        } finally {
            setIsSearching(false);
        }
    }, 300), []);

    useEffect(() => {
        performUniversalSearch(searchTerm);
    }, [searchTerm, performUniversalSearch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        const handleClickOutsideSearch = (event) => {
            if (
                searchInputRef.current && !searchInputRef.current.contains(event.target) &&
                searchResultsRef.current && !searchResultsRef.current.contains(event.target)
            ) {
                setSearchTerm('');
                setSearchResults(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideSearch);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSearch);
        };
    }, []);

    // The key changes are here:
    // This useEffect hook now has `location.pathname` and `isLoggedIn` in its dependency array.
    // This means it will re-run whenever the URL changes or the login state is manually toggled.
    useEffect(() => {
        const token = localStorage.getItem('token');
        const currentUserId = localStorage.getItem('userId');
        
        // Update isLoggedIn state based on the token
        setIsLoggedIn(!!token);

        // If a user is logged in, fetch their data
        if (token && currentUserId) {
            setUserId(currentUserId);
            api.get(`/api/auth/${currentUserId}`)
                .then(res => {
                    setUser(res.data);
                })
                .catch(err => {
                    console.error("Error fetching user data:", err);
                    setUser(null);
                    // Clear storage and state if token is invalid or user not found
                    localStorage.clear();
                    setIsLoggedIn(false);
                    setUserId(null);
                });
        } else {
            // Clear user state if not logged in
            setUser(null);
            setUserId(null);
        }
    }, [location.pathname]); // The dependency array now listens to location.pathname

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false); // Manually set state to false
        setUser(null);
        toast.success('Logged out successfully!');
        navigate('/');
        closeProfileDropdown();
    };

    const toggleDropdown = (dropdownName) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
        setIsProfileDropdownOpen(false);
    };

    const closeDropdown = () => {
        setActiveDropdown(null);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(prev => !prev);
        closeDropdown();
    };

    const closeProfileDropdown = () => {
        setIsProfileDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            let isClickInsideAnyDropdown = false;

            for (const key in dropdownRefs.current) {
                if (dropdownRefs.current[key] && dropdownRefs.current[key].contains(event.target)) {
                    isClickInsideAnyDropdown = true;
                    break;
                }
            }

            if (profileDropdownRef.current && profileDropdownRef.current.contains(event.target)) {
                isClickInsideAnyDropdown = true;
            }

            if (!isClickInsideAnyDropdown) {
                closeDropdown();
                closeProfileDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleProfileLinkClick = (path) => {
        closeProfileDropdown();
        navigate(path);
    };

    const handleSearchResultClick = (path) => {
        navigate(path);
        setSearchTerm('');
        setSearchResults(null);
    };

    return (
        <nav className="bg-white w-full py-4 shadow-sm px-2 sm:px-6 lg:px-8 fixed top-0 left-0 z-20">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <div className="flex-shrink-0 mr-6">
                    <Link to="/" className="text-gray-800 text-3xl font-bold">
                        <span className="text-blue-500">i<span className='text-orange-500'>Am</span>Freelancer</span><span className='text-orange-500'>.</span>
                    </Link>
                </div>

                <div className="flex-grow max-w-xl mx-auto relative hidden md:block">
                    <div className="relative flex items-center w-full rounded-md shadow-sm" ref={searchInputRef}>
                        <input
                            type="text"
                            placeholder="Search gigs, freelancers, orders..."
                            className="block w-full pl-4 pr-12 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-transparent text-gray-700 placeholder-gray-500"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="absolute inset-y-0 right-0 px-4 bg-gray-800 text-white rounded-r-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent">
                            {isSearching ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Search className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {searchTerm.length > 0 && searchResults && (
                        <div
                            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
                            ref={searchResultsRef}
                        >
                            {searchResults.gigs.length === 0 &&
                                searchResults.users.length === 0 &&
                                searchResults.orders.length === 0 &&
                                !isSearching ? (
                                <div className="p-4 text-gray-500">No results found for "{searchTerm}"</div>
                            ) : (
                                <>
                                    {searchResults.gigs.length > 0 && (
                                        <div className="py-2 border-b border-gray-100">
                                            <p className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">Gigs</p>
                                            {searchResults.gigs.map(gig => (
                                                <Link
                                                    key={gig._id}
                                                    to={`/view-gig/${gig._id}`}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                                                    onClick={() => handleSearchResultClick(`/view-gig/${gig._id}`)}
                                                >
                                                    <img src={gig.cover || 'https://placehold.co/40x40/DDDDDD/666666?text=Gig'} alt={gig.title} className="w-10 h-10 object-cover rounded mr-3" />
                                                    <div>
                                                        <p className="font-medium">{gig.title}</p>
                                                        <p className="text-gray-500 text-xs">${gig.price} by {gig.userId?.username}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {searchResults.users.length > 0 && (
                                        <div className="py-2 border-b border-gray-100">
                                            <p className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">Freelancers</p>
                                            {searchResults.users.map(userItem => (
                                                <Link
                                                    key={userItem._id}
                                                    to={`/view-user-profile/${userItem._id}`}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                                                    onClick={() => handleSearchResultClick(`/view-user-profile/${userItem._id}`)}
                                                >
                                                    <img src={userItem.profilePicture || 'https://placehold.co/40x40/CCCCCC/666666?text=User'} alt={userItem.username} className="w-10 h-10 rounded-full object-cover mr-3" />
                                                    <div>
                                                        <p className="font-medium">{userItem.username}</p>
                                                        <p className="text-gray-500 text-xs">{userItem.DomainDetail[0]?.freelancerDomain}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {searchResults.orders.length > 0 && (
                                        <div className="py-2">
                                            <p className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">Orders</p>
                                            {searchResults.orders.map(order => (
                                                <Link
                                                    key={order._id}
                                                    to={`/order/${order._id}`}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                                                    onClick={() => handleSearchResultClick(`/order/${order._id}`)}
                                                >
                                                    <img src={order.gigId?.cover || 'https://placehold.co/40x40/DDDDDD/666666?text=Order'} alt={order.gigId?.title} className="w-10 h-10 object-cover rounded mr-3" />
                                                    <div>
                                                        <p className="font-medium truncate">{order.gigId?.title}</p>
                                                        <p className="text-gray-500 text-xs">Status: {order.status} | Client: {order.clientId?.username}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-800 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md p-2"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                <div
                    className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto mt-4 md:mt-0`}
                >
                    <ul className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 items-center">
                        {isLoggedIn ? (
                            <>
                                <li className="main-menu flex justify-center pt-2">
                                    <div className="hidden md:flex items-center space-x-6">
                                        <Link to="/my-dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out pl-5 py-2 rounded-md">
                                            Dashboard
                                        </Link>
                                        <div className="relative" ref={el => dropdownRefs.current['myBusiness'] = el}>
                                            <button
                                                onClick={() => toggleDropdown('myBusiness')}
                                                className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out px-3 py-2 rounded-md focus:outline-none"
                                            >
                                                My Business <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${activeDropdown === 'myBusiness' ? 'rotate-180' : 'rotate-0'}`} />
                                            </button>
                                            {activeDropdown === 'myBusiness' && (
                                                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white focus:outline-none z-50">
                                                    <div className="py-1">
                                                        <Link to="/my-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Orders</Link>
                                                        {user?.userRole === "freelancer" && <Link to={`/view-gigs/${userId}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>My Gigs</Link>}
                                                        <Link to={`/profile/${userId}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Profile</Link>
                                                        {user?.userRole === "freelancer" && <Link to="/My-Earning" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Earnings</Link>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                                <li className='md:ml-3'>
                                    <Link to="/liked-gigs" className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out">
                                        <Heart className="h-5 w-5 mr-1" />
                                    </Link>
                                </li>
                                {user && (
                                    <li className="relative" ref={profileDropdownRef}>
                                        <div
                                            className="relative flex-shrink-0 cursor-pointer"
                                            onClick={toggleProfileDropdown}
                                        >
                                            <img
                                                src={user.profilePicture || 'https://placehold.co/48x48/CCCCCC/666666?text=User'}
                                                alt={user.username}
                                                className="h-10 w-10 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-all duration-200"
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48/CCCCCC/666666?text=User'; }}
                                            />
                                            {isProfileDropdownOpen && (
                                                <div className="absolute right-0 mt-3 w-48 rounded-lg shadow-xl bg-white focus:outline-none z-50 animate-fade-in-down"
                                                    style={{ transformOrigin: 'top right' }}
                                                >
                                                    <div className="py-1">
                                                        <div className="px-4 bg-blue-100 py-2 text-sm rounded-lg text-gray-800 border-b border-gray-100">
                                                            <strong className="block truncate">{user.username}<small> ( {user.userRole} ) </small></strong>
                                                        </div>
                                                        <Link
                                                            to={`/profile/${userId}`}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-150 ease-in-out"
                                                            onClick={() => handleProfileLinkClick(`/profile/${userId}`)}
                                                        >
                                                            Your Profile
                                                        </Link>
                                                        <Link
                                                            to="/user/messages"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition duration-150 ease-in-out"
                                                            onClick={() => handleProfileLinkClick("/user/messages")}
                                                        >
                                                            My Messages
                                                        </Link>
                                                        <div className="border-t border-gray-100 my-1"></div>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="block w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 transition duration-150 ease-in-out"
                                                        >
                                                            Sign out
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                )}
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className="px-5 py-2 border-2 border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out font-semibold"
                                        onClick={() => navigate("/register")}
                                    >
                                        Register
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;