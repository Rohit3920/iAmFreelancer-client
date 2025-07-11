import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../utils/api'

const DomainDetails = forwardRef(({ nextClick }, ref) => {
    const [formData, setFormData] = useState({
        freelancerDomain: '',
        technologies: [],
        domainExperience: '',
        description: '',
    });

    const [currentTechnologyInput, setCurrentTechnologyInput] = useState('');
    const [descriptionCharCount, setDescriptionCharCount] = useState(0);
    const [descriptionWordCount, setDescriptionWordCount] = useState(0);

    const MAX_DESCRIPTION_CHARS = 1000;

    useEffect(() => {
        setDescriptionCharCount(formData.description.length);
        const words = formData.description.trim().split(/\s+/).filter(word => word.length > 0);
        setDescriptionWordCount(words.length);
    }, [formData.description]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'domainExperience') {
            if (!isNaN(value) && value >= 0) {
                setFormData(prev => ({ ...prev, [name]: value }));
            } else if (value === '') {
                setFormData(prev => ({ ...prev, [name]: '' }));
            }
        } else if (name === 'description') {
            if (value.length <= MAX_DESCRIPTION_CHARS) {
                setFormData(prev => ({ ...prev, [name]: value }));
            } else {
                toast.warn(`Description cannot exceed ${MAX_DESCRIPTION_CHARS} characters.`);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddTechnology = () => {
        const trimmedTech = currentTechnologyInput.trim();
        if (trimmedTech) {
            if (!formData.technologies.includes(trimmedTech)) {
                setFormData(prev => ({
                    ...prev,
                    technologies: [...prev.technologies, trimmedTech]
                }));
                setCurrentTechnologyInput('');
            } else {
                toast.info('Technology already added!');
            }
        } else {
            toast.warn('Technology name cannot be empty.');
        }
    };

    const handleRemoveTechnology = (techToRemove) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(tech => tech !== techToRemove)
        }));
    };

    const handleTechnologyKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTechnology();
        }
    };

    useImperativeHandle(ref, () => ({
        validateAndGetData: () => {
            if (!formData.freelancerDomain.trim()) {
                toast.error('Freelancer Domain is required.');
                return null;
            }
            if (formData.technologies.length === 0) {
                toast.error('Please add at least one technology.');
                return null;
            }
            if (formData.domainExperience === '' || Number(formData.domainExperience) < 0) {
                toast.error('Domain Experience is required and must be a non-negative number.');
                return null;
            }
            if (!formData.description.trim()) {
                toast.error('Description is required.');
                return null;
            }

            const domainDetails = {
                freelancerDomain: formData.freelancerDomain,
                technologies: formData.technologies,
                domainExperience: Number(formData.domainExperience),
                description: formData.description,
            };

            console.log('Validating and getting Domain Details:', domainDetails);
            toast.success('Domain details validated successfully!');
            return domainDetails;
        }
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId')
        const res = api.put(`/api/auth/${userId}`, {DomainDetail : formData})
        console.log(res)
        if (ref.current && ref.current.validateAndGetData()) {
            nextClick();
        }
    };

    return (
        <div className="min-h-screen w-1/2 bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-4xl border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Domain Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="freelancerDomain" className="block text-sm font-medium text-gray-700 mb-1">
                            Freelancer Domain <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="freelancerDomain"
                            name="freelancerDomain"
                            value={formData.freelancerDomain}
                            onChange={handleChange}
                            placeholder="e.g., Web Development, Graphic Design, Content Writing"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="technologyInput" className="block text-sm font-medium text-gray-700 mb-1">
                            Technologies <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                id="technologyInput"
                                value={currentTechnologyInput}
                                onChange={(e) => setCurrentTechnologyInput(e.target.value)}
                                onKeyPress={handleTechnologyKeyPress}
                                placeholder="e.g., React, Node.js, Photoshop"
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={handleAddTechnology}
                                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out rounded-lg"
                            >
                                Add Technology
                            </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {formData.technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 rounded-lg"
                                >
                                    {tech}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTechnology(tech)}
                                        className="ml-2 -mr-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="domainExperience" className="block text-sm font-medium text-gray-700 mb-1">
                            Domain Experience (Years) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="domainExperience"
                            name="domainExperience"
                            value={formData.domainExperience}
                            onChange={handleChange}
                            placeholder="e.g., 5"
                            min="0"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description (up to 1000 characters) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="8"
                            placeholder="Provide a detailed description of your experience, skills, and what you offer in your freelancer domain..."
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y transition duration-150 ease-in-out rounded-lg"
                            required
                        ></textarea>
                        <div className="text-right text-xs text-gray-500 mt-1">
                            {descriptionWordCount} words / {descriptionCharCount} characters (Max approx. 1000 characters)
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-md shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-150 ease-in-out text-lg rounded-lg"
                    >
                        Save Domain Details
                    </button>
                </form>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
});

export default DomainDetails;