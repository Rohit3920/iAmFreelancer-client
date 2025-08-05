import React, { useCallback, useEffect, useRef, useState } from 'react';
import api from '../utils/api';
import { Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import Journey from '../component/home/recommended/Journey';
import FillDetail from '../component/home/recommended/FillDetail';
import KeepExploring from '../component/home/KeepExploring';
import TopGigs from '../component/home/TopGigs';
import PopularFreelancer from '../component/home/PopularFreelancer';
import Footer from '../component/Footer';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import filterData from '../utils/gigCoreData.json';

function Home() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [popularUsers, setPopularUsers] = useState([]);
    const [popularGig, setPopularGig] = useState([]);
    const [exploringGig, setExploringGig] = useState([]);
    const [filteredGigsData, setFilteredGigsData] = useState([]);
    const userId = localStorage.getItem('userId');

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef(null);
    const searchResultsRef = useRef(null);

    const [selectedFilters, setSelectedFilters] = useState({
        mainCategory: '',
        priceRange: '',
    });

    const [openFilter, setOpenFilter] = useState({
        mainCategory: false,
        priceRange: false,
    });

    const [showFilters, setShowFilters] = useState(true);

    const priceRanges = [
        { label: 'Any', value: '' },
        { label: '< $20', value: '0-20' },
        { label: '$21 - $50', value: '21-50' },
        { label: '$51 - $100', value: '51-100' },
        { label: '> $100', value: '101-max' },
    ];

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prevState => ({ ...prevState, [filterType]: value }));
    };

    const handleFilterToggle = (filterType) => {
        setOpenFilter(prevState => ({ ...prevState, [filterType]: !prevState[filterType] }));
    };

    const toggleFilterVisibility = () => {
        setShowFilters(prevState => !prevState);
    };

    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const performUniversalSearch = useCallback(
        debounce(async (query) => {
            if (query.length === 0) {
                setSearchResults(null);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const res = await api.get(`/api/search/universal?q=${query}`);
                const filteredUsers = res.data.data.users.filter(
                    (u) => u.userRole === 'freelancer'
                );

                setSearchResults({
                    gigs: res.data.data.gigs,
                    orders: res.data.data.orders,
                    users: filteredUsers,
                });
            } catch (error) {
                toast.error('Failed to fetch search results.');
                console.warn(error)
            } finally {
                setIsSearching(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        const handleClickOutsideSearch = (event) => {
            if (
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target) &&
                searchResultsRef.current &&
                !searchResultsRef.current.contains(event.target)
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

    useEffect(() => {
        performUniversalSearch(searchTerm);
    }, [searchTerm, performUniversalSearch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchResultClick = (path) => {
        navigate(path);
        setSearchTerm('');
        setSearchResults(null);
    };

    useEffect(() => {
        const { mainCategory, priceRange } = selectedFilters;
        let tempFilteredGigs = [...exploringGig];

        if (mainCategory) {
            tempFilteredGigs = tempFilteredGigs.filter(gig => gig.categoryMain === mainCategory);
        }

        if (priceRange) {
            const [minStr, maxStr] = priceRange.split('-');
            const minPrice = parseFloat(minStr);
            const maxPrice = maxStr === 'max' ? Infinity : parseFloat(maxStr);

            tempFilteredGigs = tempFilteredGigs.filter(gig =>
                gig.price >= minPrice && gig.price <= maxPrice
            );
        }

        setFilteredGigsData(tempFilteredGigs);
    }, [selectedFilters, exploringGig]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, gigsRes, usersRes] = await Promise.all([
                    userId ? api.get(`api/auth/${userId}`) : Promise.resolve(null),
                    api.get('/api/gig'),
                    api.get('api/auth/'),
                ]);

                if (userRes) {
                    setCurrentUser(userRes.data);
                }

                if (gigsRes) {
                    setExploringGig(gigsRes.data);
                    const sortedGigs = gigsRes.data.sort((a, b) => {
                        const ratingA = a.starNumber > 0 ? a.totalStars / a.starNumber : 0;
                        const ratingB = b.starNumber > 0 ? b.totalStars / b.starNumber : 0;
                        return ratingB - ratingA;
                    });
                    setPopularGig(sortedGigs.slice(0, 20));
                }

                if (usersRes) {
                    setPopularUsers(usersRes.data.slice(0, 20));
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                toast.error('Failed to load data.');
            }
        };
        fetchData();
    }, [userId]);

    const isFilterActive = selectedFilters.mainCategory || selectedFilters.priceRange;

    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased">
            <div
                className="relative bg-cover bg-center h-54 md:h-80 flex flex-col justify-between p-6 rounded-b-lg shadow-md"
                style={{
                    backgroundImage: `url(background.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-blue-900 opacity-75 rounded-b-lg"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <h1 className="text-white text-3xl md:text-4xl font-bold">
                        Welcome back, {currentUser?.username}
                        {currentUser?.userRole === 'freelancer' && (
                            <small className="text-xs">
                                ({currentUser?.DomainDetail?.[0]?.freelancerDomain})
                            </small>
                        )}
                    </h1>
                    <span className="text-white text-sm md:text-base italic">
                        Made on{' '}
                        <a
                            href="https://rohit3920.github.io/my-portfolio-2.O/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Rohit3920
                        </a>
                    </span>
                </div>

                <div
                    className="relative flex items-center w-full rounded-md shadow-sm md:hidden"
                    ref={searchInputRef}
                >
                    <input
                        type="text"
                        placeholder="Search gigs, freelancers, orders..."
                        className="block w-full pl-4 pr-12 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-transparent text-gray-700 placeholder-gray-500"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button
                        className="absolute inset-y-0 right-0 px-4 bg-gray-800 text-white rounded-r-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                    >
                        {isSearching ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            <Search className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {searchTerm.length > 0 && searchResults && (
                    <div
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto md:hidden"
                        ref={searchResultsRef}
                    >
                        {searchResults.gigs.length === 0 &&
                            searchResults.users.length === 0 &&
                            searchResults.orders.length === 0 &&
                            !isSearching ? (
                            <div className="p-4 text-gray-500">
                                No results found for "{searchTerm}"
                            </div>
                        ) : (
                            <>
                                {searchResults.gigs.length > 0 && (
                                    <div className="py-2 border-b border-gray-100">
                                        <p className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                                            Gigs
                                        </p>
                                        {searchResults.gigs.map((gig) => (
                                            <Link
                                                key={gig._id}
                                                to={`/view-gig/${gig._id}`}
                                                className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                                                onClick={() => handleSearchResultClick(`/view-gig/${gig._id}`)}
                                            >
                                                <img
                                                    src={gig.cover || 'https://placehold.co/40x40/DDDDDD/666666?text=Gig'}
                                                    alt={gig.title}
                                                    className="w-10 h-10 object-cover rounded mr-3"
                                                />
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
                                        <p className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                                            Freelancers
                                        </p>
                                        {searchResults.users.map((userItem) => (
                                            <Link
                                                key={userItem._id}
                                                to={`/view-user-profile/${userItem._id}`}
                                                className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                                                onClick={() => handleSearchResultClick(`/view-user-profile/${userItem._id}`)}
                                            >
                                                <img
                                                    src={userItem.profilePicture || 'https://placehold.co/40x40/CCCCCC/666666?text=User'}
                                                    alt={userItem.username}
                                                    className="w-10 h-10 rounded-full object-cover mr-3"
                                                />
                                                <div>
                                                    <p className="font-medium">{userItem.username}</p>
                                                    <p className="text-gray-500 text-xs">
                                                        {userItem.DomainDetail?.[0]?.freelancerDomain}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {searchResults.orders.length > 0 && (
                                    <div className="py-2">
                                        <p className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50">
                                            Orders
                                        </p>
                                        {searchResults.orders.map((order) => (
                                            <Link
                                                key={order._id}
                                                to={`/order/${order._id}`}
                                                className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition duration-150 ease-in-out"
                                                onClick={() => handleSearchResultClick(`/order/${order._id}`)}
                                            >
                                                <img
                                                    src={order.gigId?.cover || 'https://placehold.co/40x40/DDDDDD/666666?text=Order'}
                                                    alt={order.gigId?.title}
                                                    className="w-10 h-10 object-cover rounded mr-3"
                                                />
                                                <div>
                                                    <p className="font-medium truncate">{order.gigId?.title}</p>
                                                    <p className="text-gray-500 text-xs">
                                                        Status: {order.status} | Client: {order.clientId?.username}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                <div className="relative z-10 flex flex-col justify-center items-center gap-4 mt-8 md:flex-row md:mt-0 hidden md:flex">
                    {currentUser?.userRole === 'user' && (
                        <Journey userData={currentUser} />
                    )}
                    <FillDetail />
                </div>
            </div>

            <div className="flex flex-col md:flex-row mx-auto max-w-7xl mt-4 gap-4">
                <div className="flex justify-end mb-4 md:hidden">
                    <button
                        onClick={toggleFilterVisibility}
                        className="flex items-center px-4 py-2 bg-white-600 text-blue rounded-md shadow-md hover:bg-blue-100 transition duration-200"
                    >
                        <Filter size={18} className="mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                <div className={`w-full md:w-1/5 bg-white p-4 shadow-md rounded-lg transition-all duration-300 ease-in-out md:sticky md:top-0 md:self-start md:h-[calc(100vh-100px)] md:overflow-y-auto ${showFilters ? 'block' : 'hidden md:block'}`}>
                    <h2 className="text-lg font-bold mb-4 text-black">Filters & Explore</h2>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => handleFilterToggle('mainCategory')}>
                            <span className="text-base font-semibold text-gray-800">Category</span>
                            {openFilter.mainCategory ? <ChevronUp size={16} className="text-gray-600" /> : <ChevronDown size={16} className="text-gray-600" />}
                        </div>
                        {openFilter.mainCategory && (
                            <ul className="space-y-2">
                                {filterData.categories.map(cat => (
                                    <li
                                        key={cat.main}
                                        className={`p-2 rounded-md cursor-pointer text-sm ${selectedFilters.mainCategory === cat.main ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                                        onClick={() => {
                                            handleFilterChange('mainCategory', cat.main);
                                            setOpenFilter({ mainCategory: false, priceRange: openFilter.priceRange });
                                        }}
                                    >
                                        {cat.main}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => handleFilterToggle('priceRange')}>
                            <span className="text-base font-semibold text-gray-800">Price</span>
                            {openFilter.priceRange ? <ChevronUp size={16} className="text-gray-600" /> : <ChevronDown size={16} className="text-gray-600" />}
                        </div>
                        {openFilter.priceRange && (
                            <ul className="space-y-2">
                                {priceRanges.map(range => (
                                    <li
                                        key={range.value}
                                        className={`p-2 rounded-md cursor-pointer text-sm ${selectedFilters.priceRange === range.value ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                                        onClick={() => handleFilterChange('priceRange', range.value)}
                                    >
                                        {range.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className={`w-full ${showFilters ? 'md:w-4/5' : 'md:w-full'}`}>
                    {isFilterActive ? (
                        <>
                            <KeepExploring exploringGig={filteredGigsData} />
                            <TopGigs popularGig={filteredGigsData} />
                            <PopularFreelancer popularUsers={popularUsers} />
                        </>
                    ) : (
                        <>
                            <KeepExploring exploringGig={exploringGig} />
                            <PopularFreelancer popularUsers={popularUsers} />
                            <TopGigs popularGig={popularGig} />
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;