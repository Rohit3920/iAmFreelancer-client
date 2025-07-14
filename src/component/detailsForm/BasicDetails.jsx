import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../utils/api';

function BasicDetails({ nextClick, myFormData }) {
    const [formData, setFormData] = useState({
        language: myFormData.language || [],
        contactNo: myFormData.contactNo || '',
        gender: myFormData.gender || '',
        dob: myFormData.dob || '',
    });

    const [currentLanguageInput, setCurrentLanguageInput] = useState('');

    useEffect(() => {
        setFormData({
            language: myFormData.language || [],
            contactNo: myFormData.contactNo || '',
            gender: myFormData.gender || '',
            dob: myFormData.dob || '',
        });
    }, [myFormData]);

    const handleAddLanguage = () => {
        const trimmedLang = currentLanguageInput.trim();
        if (trimmedLang) {
            if (!formData.language.includes(trimmedLang)) {
                setFormData((prev) => ({
                    ...prev,
                    language: [...prev.language, trimmedLang],
                }));
                setCurrentLanguageInput('');
            } else {
                toast.info('Language already added!');
            }
        } else {
            toast.warn('Language name cannot be empty.');
        }
    };

    const handleRemoveLanguage = (langToRemove) => {
        setFormData((prev) => ({
            ...prev,
            language: prev.language.filter((lang) => lang !== langToRemove),
        }));
    };

    const handleLanguageKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddLanguage();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.language.length === 0) {
            toast.error('At least one Language is required.');
            return;
        }
        if (!formData.contactNo.trim() || !/^\d{10}$/.test(formData.contactNo)) {
            toast.error('A valid 10-digit Contact Number is required.');
            return;
        }
        if (!formData.gender) {
            toast.error('Gender is required.');
            return;
        }
        if (!formData.dob) {
            toast.error('Date of Birth is required.');
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                toast.error('User not authenticated. Please log in again.');
                return;
            }
            await api.put(`/api/auth/${userId}`, { basic: formData });
            toast.success('Basic details submitted successfully!');
            nextClick();
        } catch (error) {
            console.error('Error submitting basic details:', error);
            toast.error('Failed to save basic details. Please try again.');
        }
    };

    return (
        <div className="min-h-screen w-1/2 text-left bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-4xl border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Basic Details
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="contactNo"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="contactNo"
                            name="contactNo"
                            value={formData.contactNo}
                            onChange={handleChange}
                            placeholder="e.g., 1234567890"
                            pattern="[0-9]{10}"
                            maxLength="10"
                            className="mt-1 block max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Please enter a 10-digit number.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="languageInput"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Languages <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                id="languageInput"
                                value={currentLanguageInput}
                                onChange={(e) => setCurrentLanguageInput(e.target.value)}
                                onKeyPress={handleLanguageKeyPress}
                                placeholder="e.g. Marathi, English, Hindi"
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={handleAddLanguage}
                                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out rounded-lg"
                            >
                                Add
                            </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {formData.language.map((lang, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 rounded-lg"
                                >
                                    {lang}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveLanguage(lang)}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 flex flex-wrap gap-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value={'Male'}
                                    checked={formData.gender === 'Male'}
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                />
                                <span className="ml-2 text-gray-700">Male</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === 'Female'}
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                />
                                <span className="ml-2 text-gray-700">Female</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Other"
                                    checked={formData.gender === 'Other'}
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                />
                                <span className="ml-2 text-gray-700">Other</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="dob"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="mt-1 block max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-md shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-150 ease-in-out text-lg rounded-lg"
                    >
                        Save Basic Details
                    </button>
                </form>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default BasicDetails;