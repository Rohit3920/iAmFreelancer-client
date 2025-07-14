import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../utils/api'

function EducationDetails({ nextClick, myFormData }) {
    console.log('EducationDetails component rendered with myFormData:', myFormData);
    const [formData, setFormData] = useState({
        degree: myFormData.degree || '',
        fieldOfStudy: myFormData.fieldOfStudy || '',
        institutionName: myFormData.institutionName || '',
        graduationYear: myFormData.graduationYear || '',
        percentage: myFormData.percentage || '',
        description: myFormData.description || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.degree.trim()) {
            toast.error('Degree/Qualification is required.');
            return;
        }
        if (!formData.fieldOfStudy.trim()) {
            toast.error('Field of Study is required.');
            return;
        }
        if (!formData.institutionName.trim()) {
            toast.error(' UniversityName is required.');
            return;
        }
        if (!formData.graduationYear.trim() || !/^\d{4}$/.test(formData.graduationYear)) {
            toast.error('A valid 4-digit Graduation Year is required.');
            return;
        }

        const userId = localStorage.getItem('userId')
        const res = api.put(`/api/auth/${userId}`, { education: formData })
        console.log(res)
        console.log('Submitted Education Details:', formData);
        const done = toast.success('Education details submitted successfully!');
        if (done) {
            nextClick()
        }
    };

    return (
        <div className="min-h-screen w-1/2 bg-gray-100 flex items-center justify-center p-4 sm:p-6 text-left font-sans">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-4xl border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Education Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                            Degree/Qualification <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="degree"
                            name="degree"
                            value={formData.degree}
                            onChange={handleChange}
                            placeholder="e.g., Bachelor's Degree, High School Diploma"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
                            Field of Study <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fieldOfStudy"
                            name="fieldOfStudy"
                            value={formData.fieldOfStudy}
                            onChange={handleChange}
                            placeholder="e.g., Computer Science, Business Administration"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">
                            UniversityName <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="institutionName"
                            name="institutionName"
                            value={formData.institutionName}
                            onChange={handleChange}
                            placeholder="e.g., University of XYZ"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Graduation Year <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="graduationYear"
                            name="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            placeholder="e.g., 2023"
                            min="1900"
                            max={new Date().getFullYear() + 10}
                            className="mt-1 block max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700 mb-1">
                            CGPA/Percentage (Optional)
                        </label>
                        <input
                            type="text"
                            id="cgpa"
                            name="cgpa"
                            value={formData.percentage}
                            onChange={handleChange}
                            placeholder="e.g., 3.8/4.0 or 90%"
                            className="mt-1 block max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description/Achievements (Optional)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="e.g., Dean's List, relevant projects, thesis topic..."
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y transition duration-150 ease-in-out rounded-lg"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-md shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-150 ease-in-out text-lg rounded-lg"
                    >
                        Save Education Details
                    </button>
                </form>
            </div>

            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default EducationDetails;
