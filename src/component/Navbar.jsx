import React, { useState } from 'react';
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
// Navbar component
function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const Navigate = useNavigate();

    return (
        <nav className="bg-white w-full py-4 shadow-sm py-4 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 z-10 ">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                <div className="flex-shrink-0 mr-6">
                    <a href="#" className="text-gray-800 text-3xl font-bold">
                        <span className="text-blue-500">i<span className='text-orange-500'>Am</span>Freelancer</span><span className='text-orange-500'>.</span>
                    </a>
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
                    className={`${isMenuOpen ? 'block' : 'hidden'
                        } w-full md:flex md:items-center md:w-auto mt-4 md:mt-0`}
                >
                    <ul className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 items-center">
                        <li className='ml-3'>
                            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out">
                                Become a Freelancer
                            </a>
                        </li>
                        <li>
                            <a href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 ease-in-out">
                                Login
                            </a>
                        </li>
                        <li>
                            <button className="px-5 py-2 border-2 border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out font-semibold"
                            onClick={()=> Navigate("/register")}>
                                Register
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
