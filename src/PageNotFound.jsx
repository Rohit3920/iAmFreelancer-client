import React from 'react';
import { Link } from 'react-router-dom'; 
const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 font-inter">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                <h1 className="text-9xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4 animate-bounce">
                    404
                </h1>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Page Not Found
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Oops! It looks like the page you're trying to reach doesn't exist.
                    Perhaps you typed the address incorrectly, or the page has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    <svg
                        className="-ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
