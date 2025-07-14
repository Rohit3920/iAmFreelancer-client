import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../utils/api'

function AddressDetails({ nextClick, myFormData }) {
    const [formData, setFormData] = useState({
        street: myFormData.street || '',
        city: myFormData.city || '',
        state: myFormData.state || '',
        zipCode: myFormData.zipCode || '',
        country: 'India',
        addressType: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.street.trim()) {
            toast.error('Address Line 1 (Street) is required.');
            return;
        }
        if (!formData.city.trim()) {
            toast.error('City is required.');
            return;
        }
        if (!formData.state.trim()) {
            toast.error('State/Province/Region is required.');
            return;
        }
        if (!formData.zipCode) {
            toast.error('A valid ZIP/Postal Code is required (e.g., 123456 or 12345-6789).');
            return;
        }
        if (!formData.country.trim()) {
            toast.error('Country is required.');
            return;
        }
        if (!formData.addressType) {
            toast.error('Address Type is required.');
            return;
        }

        console.log('Submitted Address Details:', formData);
        const done = toast.success('Address details submitted successfully!');
        const userId = localStorage.getItem('userId')
        const res = api.put(`/api/auth/${userId}`, { address: formData })
        console.log(res)
        if (done) {
            nextClick()
        }
    };

    return (
        <div className="min-h-screen w-1/2 bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-4xl border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Address Details</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-[min-content_1fr] items-baseline gap-x-4 gap-y-4">
                    <label htmlFor="street" className="text-right text-gray-800 whitespace-nowrap">Address Line1:</label>
                    <div>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder='Apartment, suite, unit, building, floor, etc.'
                            className="block max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            required
                        />
                    </div>

                    <label htmlFor="city" className="text-right text-gray-800 whitespace-nowrap">City:</label>
                    <div>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="block max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            required
                        />
                    </div>

                    <label htmlFor="state" className="text-right text-gray-800 whitespace-nowrap">State/Province/Region:</label>
                    <div>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="block max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            required
                        />
                    </div>

                    <label htmlFor="zipCode" className="text-right text-gray-800 whitespace-nowrap">ZIP/Postal/Pin Code:</label>
                    <div>
                        <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            placeholder="e.g., 100010 or 10001-0001"
                            className="block max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                            required
                        />
                    </div>

                    <label htmlFor="country" className="text-right text-gray-800 whitespace-nowrap">Country:</label>
                    <div>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="block max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out appearance-none bg-white pr-8"
                            required
                        >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                        </select>
                    </div>

                    <label className="col-span-2 block text-left ml-20 text-sm font-medium text-gray-700 mt-2">
                        Address Type <span className="text-red-500">*</span>
                    </label>
                    <div className="col-span-2 flex flex-wrap gap-4 ml-15">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="addressType"
                                value="Permanent"
                                checked={formData.addressType === 'Permanent'}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                required
                            />
                            <span className="ml-2 text-gray-700">Permanent</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="addressType"
                                value="Current"
                                checked={formData.addressType === 'Current'}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                required
                            />
                            <span className="ml-2 text-gray-700">Current</span>
                        </label>
                    </div>

                    <div className="col-span-2 pt-4">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-md shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-150 ease-in-out text-lg rounded-lg"
                        >
                            Save Address Details
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default AddressDetails;
