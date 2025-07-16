import React, { useState } from 'react';

function GigSearchTags({ formData, handleAddSearchTag, handleRemoveSearchTag }) {
    console.log(formData)
    const [currentSearchTagInput, setCurrentSearchTagInput] = useState('');

    const handleSearchTagKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSearchTag(currentSearchTagInput);
            setCurrentSearchTagInput('');
        }
    };

    return (
        <div>
            <label
                htmlFor="searchTagInput"
                className="block text-sm font-semibold text-gray-700 mb-1"
            >
                Search Tags <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
                Tag your Gig with buzz words that are relevant to the services you
                offer. Use all 5 tags to get found.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    id="searchTagInput"
                    value={currentSearchTagInput}
                    onChange={(e) => setCurrentSearchTagInput(e.target.value)}
                    onKeyPress={handleSearchTagKeyPress}
                    placeholder="Enter search terms you feel your buyers will use when looking for your service."
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                />
                <button
                    type="button"
                    onClick={() => {
                        handleAddSearchTag(currentSearchTagInput);
                        setCurrentSearchTagInput('');
                    }}
                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out rounded-lg"
                >
                    Add Tag
                </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {formData.searchTags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 rounded-lg"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleRemoveSearchTag(tag)}
                            className="ml-2 -mr-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <svg
                                className="h-2.5 w-2.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default GigSearchTags;