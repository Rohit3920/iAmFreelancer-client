import React, { useState } from 'react';

function GigDetails({ formData, handleChange, handleMainCategoryChange, handleAddSubCategory, handleRemoveSubCategory, categories, subCategories }) {
    const [tempSubCategorySelection, setTempSubCategorySelection] = useState('');

    const handleAddSubCategoryFromDropdown = (e) => {
        const newSubCategory = e.target.value;
        setTempSubCategorySelection('');
        handleAddSubCategory(newSubCategory);
    };

    return (
        <div className="space-y-8">
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Gig Title <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                    As your Gig storefront, your title is the most important place to
                    include keywords that buyers would likely use to search for a
                    service like yours.
                </p>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="I will do something I am good at ....."
                    maxLength="80"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                />
                <p className="mt-1 text-xs text-gray-500 text-right">
                    {formData.title.length}/80
                </p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                    Choose the category and sub-category most suitable for your Gig.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        name="categoryMain"
                        value={formData.categoryMain}
                        onChange={handleMainCategoryChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                    >
                        <option value="">Select Main Category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat.main}>
                                {cat.main}
                            </option>
                        ))}
                    </select>
                    <select
                        name="categorySubDropdown"
                        value={tempSubCategorySelection}
                        onChange={handleAddSubCategoryFromDropdown}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                        disabled={!formData.categoryMain}
                    >
                        <option value="">Select Sub-Category to Add</option>
                        {subCategories.map((subCat) => (
                            <option key={subCat} value={subCat}>
                                {subCat}
                            </option>
                        ))}
                    </select>
                </div>
                {formData.categoryMain && (
                    <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700">
                            Added Sub-Categories:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {formData.categorySub.length > 0 ? (
                                formData.categorySub.map((subCat) => (
                                    <span
                                        key={subCat}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition duration-150 ease-in-out rounded-lg"
                                        onClick={() => handleRemoveSubCategory(subCat)}
                                    >
                                        {formData.categoryMain} &gt; {subCat}
                                        <button type="button" className="ml-2 -mr-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 hover:bg-blue-300">
                                            <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No sub-categories added yet.</p>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Select a sub-category from the dropdown to add it. Click on an added sub-category to remove it.
                        </p>
                    </div>
                )}
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your gig in detail..."
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                ></textarea>
            </div>

            <div>
                <label
                    htmlFor="price"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Price <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    min="0"
                    className="mt-1 block max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                />
                <div className="mt-2">
                {[3, 5, 10, 20, 50, 100].map((price) => (
                    <span key={price} onClick={()=>handleChange({target: {name: 'price', value: price}})} className="inline-block cursor-pointer px-2 py-1 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md mr-2">
                        ${price}
                    </span>
                ))}
                </div>
                <div className="text-sm text-gray-500">
                    This is the price for your gig.
                </div>
            </div>
        </div>
    );
}

export default GigDetails;