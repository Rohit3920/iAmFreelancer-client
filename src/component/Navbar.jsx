import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
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
    const dropdownRefs = useRef({});
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    const toggleDropdown = (dropdownName) => {
        setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    };

    const closeDropdown = () => {
        setActiveDropdown(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            let isClickInsideDropdown = false;
            for (const key in dropdownRefs.current) {
                if (dropdownRefs.current[key] && dropdownRefs.current[key].contains(event.target)) {
                    isClickInsideDropdown = true;
                    break;
                }
            }
            if (!isClickInsideDropdown && activeDropdown) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    return (
        <nav className="bg-white w-full pt-4 shadow-sm px-4 sm:px-6 lg:px-8 fixed top-0 left-0 z-10">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <div className="flex-shrink-0 mr-6">
                    <Link to="/" className="text-gray-800 text-3xl font-bold">
                        <span className="text-blue-500">i<span className='text-orange-500'>Am</span>Freelancer</span><span className='text-orange-500'>.</span>
                    </Link>
                </div>

                <div className="flex-grow max-w-xl mx-auto hidden md:block">
                    <div className="relative flex items-center w-full rounded-md shadow-sm">
                        <input
                            type="text"
                            placeholder="Search services"
                            className="block w-full pl-4 pr-12 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-transparent text-gray-700 placeholder-gray-500"
                        />
                        <button className="absolute inset-y-0 right-0 px-4 bg-gray-800 text-white rounded-r-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent">
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
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
                        <li className='md:ml-3'>
                            <Link to="#" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out">
                                Become a Freelancer
                            </Link>
                        </li>

                        {!isLoggedIn ? (
                            <>
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
                        ) : (
                            <li>
                                <button
                                    className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out font-semibold"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="main-menu flex justify-center pt-2">
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out px-3 py-2 rounded-md">
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
                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <div className="py-1">
                                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Orders</Link>
                                    <Link to="/view-gigs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Gigs</Link>
                                    <Link to={`/profile/${userId}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Profile</Link>
                                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Earnings</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={el => dropdownRefs.current['growthMarketing'] = el}>
                        <button
                            onClick={() => toggleDropdown('growthMarketing')}
                            className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out px-3 py-2 rounded-md focus:outline-none"
                        >
                            Growth & Marketing <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${activeDropdown === 'growthMarketing' ? 'rotate-180' : 'rotate-0'}`} />
                        </button>
                        {activeDropdown === 'growthMarketing' && (
                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <div className="py-1">
                                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Promotions</Link>
                                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Analytics</Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={el => dropdownRefs.current['analytics'] = el}>
                        <button
                            onClick={() => toggleDropdown('analytics')}
                            className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out px-3 py-2 rounded-md focus:outline-none"
                        >
                            Analytics <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${activeDropdown === 'analytics' ? 'rotate-180' : 'rotate-0'}`} />
                        </button>
                        {activeDropdown === 'analytics' && (
                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <div className="py-1">
                                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Reports</Link>
                                    <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={closeDropdown}>Performance</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;