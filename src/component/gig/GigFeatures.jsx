import React from 'react';

function GigFeatures({ formData, handleChange, handleMultiSelectChange, gigHelpingTypes, coreFeatures }) {
    const handleCoreFeaturesChange = (e) => {
        const { options } = e.target;
        const value = Array.from(options)
            .filter((option) => option.selected)
            .map((option) => option.value);
        handleMultiSelectChange('coreFeatures', value);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="shortTitle"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Short Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="shortTitle"
                        name="shortTitle"
                        value={formData.shortTitle}
                        onChange={handleChange}
                        placeholder="Brief title for your gig"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                    />
                </div>
                <div>
                    <label
                        htmlFor="shortDesc"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Short Description <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="shortDesc"
                        name="shortDesc"
                        value={formData.shortDesc}
                        onChange={handleChange}
                        placeholder="A concise summary of your gig"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="deliveryTime"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Delivery Time (Days) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="deliveryTime"
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        min="1"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                    />
                </div>
                <div>
                    <label
                        htmlFor="revisionNumber"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Revision Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="revisionNumber"
                        name="revisionNumber"
                        value={formData.revisionNumber}
                        onChange={handleChange}
                        min="0"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Gig metadata / Features <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label
                            htmlFor="serviceType"
                            className="block text-xs font-medium text-gray-600 mb-1"
                        >
                            Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="serviceType"
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                        >
                            <option value="">Select service type you support</option>
                            {gigHelpingTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="coreFeatures"
                            className="block text-xs font-medium text-gray-600 mb-1"
                        >
                            Core Features <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="coreFeatures"
                            name="coreFeatures"
                            multiple
                            value={formData.coreFeatures}
                            onChange={handleCoreFeaturesChange}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg h-24"
                        >
                            {coreFeatures.map((feature) => (
                                <option key={feature} value={feature}>
                                    {feature}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Hold Ctrl/Cmd to select multiple.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GigFeatures;