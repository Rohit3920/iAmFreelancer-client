import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../utils/api';
import gigCoreData from '../../utils/gigCoreData';
import GigDetails from '../../component/gig/GigDetails';
import GigCoverImage from '../../component/gig/GigCoverImage';
import GigAdditionalImages from '../../component/gig/GigAdditionalImages';
import GigFeatures from '../../component/gig/GigFeatures';
import GigSearchTags from '../../component/gig/GigSearchTags';
import { useNavigate } from 'react-router-dom';

function CreateGig() {
    const navigate = useNavigate();
    const categories = gigCoreData.categories;
    const gigHelpingTypes = gigCoreData.gigHelpingTypes;
    const coreFeatures = gigCoreData.coreFeatures;

    const [formData, setFormData] = useState({
        userId : localStorage.getItem('userId'),
        title: '',
        description: '',
        categoryMain: '',
        categorySub: [],
        price: 0,

        cover: null,

        images: [],

        shortTitle: '',
        shortDesc: '',
        deliveryTime: 3,
        revisionNumber: 1,
        coreFeatures: [],
        serviceType: '',

        // plugins: [],
        searchTags: [],
    });

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const handleNextStep = () => {
        if (validateCurrentStep()) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (name, file) => {
        setFormData((prev) => ({ ...prev, [name]: file }));
    };

    const handleMultiFileChange = (name, files) => {
        setFormData((prev) => ({ ...prev, [name]: files }));
    };

    const handleMainCategoryChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value, categorySub: [] }));
    };

    const handleAddSubCategory = (newSubCategory) => {
        if (newSubCategory && newSubCategory !== "" && !formData.categorySub.includes(newSubCategory)) {
            setFormData((prev) => ({
                ...prev,
                categorySub: [...prev.categorySub, newSubCategory],
            }));
        } else if (newSubCategory && newSubCategory !== "") {
            toast.info(`${newSubCategory} is already added!`);
        }
    };

    const handleRemoveSubCategory = (subCatToRemove) => {
        setFormData((prev) => ({
            ...prev,
            categorySub: prev.categorySub.filter((s) => s !== subCatToRemove),
        }));
    };

    const handleMultiSelectChange = (name, selectedOptions) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    };

    const handleAddSearchTag = (newTag) => {
        const trimmedTag = newTag.trim();
        if (trimmedTag) {
            if (!formData.searchTags.includes(trimmedTag)) {
                setFormData((prev) => ({
                    ...prev,
                    searchTags: [...prev.searchTags, trimmedTag],
                }));
            } else {
                toast.info('Tag already added!');
            }
        } else {
            toast.warn('Tag cannot be empty.');
        }
    };

    const handleRemoveSearchTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            searchTags: prev.searchTags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const validateCurrentStep = () => {
        switch (currentStep) {
            case 1:
                if (!formData.title.trim()) {
                    toast.error('Gig Title is required.');
                    return false;
                }
                if (!formData.description.trim()) {
                    toast.error('Description is required.');
                    return false;
                }
                if (!formData.categoryMain) {
                    toast.error('Main category is required.');
                    return false;
                }
                if (formData.categorySub.length === 0) {
                    toast.error('At least one sub-category is required.');
                    return false;
                }
                if (!formData.price || formData.price <= 0) {
                    toast.error('Price must be a positive number.');
                    return false;
                }
                return true;
            case 2:
                if (!formData.cover) {
                    toast.error('Cover image is required.');
                    return false;
                }
                return true;
            case 3:
                if (formData.images.length === 0) {
                    toast.error('At least one additional image is required.');
                    return false;
                }
                return true;
            case 4:
                if (!formData.shortTitle.trim()) {
                    toast.error('Short Title is required.');
                    return false;
                }
                if (!formData.shortDesc.trim()) {
                    toast.error('Short Description is required.');
                    return false;
                }
                if (!formData.deliveryTime || formData.deliveryTime <= 0) {
                    toast.error('Delivery Time must be a positive number.');
                    return false;
                }
                if (formData.revisionNumber < 0) {
                    toast.error('Revision Number cannot be negative.');
                    return false;
                }
                if (!formData.serviceType) {
                    toast.error('Service Type is required.');
                    return false;
                }
                if (formData.coreFeatures.length === 0) {
                    toast.error('At least one core feature is required.');
                    return false;
                }
                return true;
            case 5:
                if (formData.searchTags.length === 0) {
                    toast.error('At least one search tag is required.');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateCurrentStep()) {
            toast.success('Gig details submitted successfully!');

        try {
            const res = await api.post(`/api/gig`, formData);
            toast.success('Submitted Gig Data successfully!');
            if(res.data) {
                navigate(`/view-gig/${res.data._id}`);
            }
        } catch (err) {
            console.error('Submission error:', err);
            toast.error('Failed to create gig.');
        }
        }
    };

    const selectedMainCategory = categories.find(
        (cat) => cat.main === formData.categoryMain
    );
    const subCategories = selectedMainCategory ? selectedMainCategory.sub : [];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-4xl border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Create a New Gig
                </h2>
                <div className="flex justify-around mb-8">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                ${currentStep >= step ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                {step}
                            </div>
                            <p className="mt-2 text-sm text-gray-600">Step {step}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {currentStep === 1 && (
                        <GigDetails
                            formData={formData}
                            handleChange={handleChange}
                            handleMainCategoryChange={handleMainCategoryChange}
                            handleAddSubCategory={handleAddSubCategory}
                            handleRemoveSubCategory={handleRemoveSubCategory}
                            categories={categories}
                            subCategories={subCategories}
                        />
                    )}

                    {currentStep === 2 && (
                        <GigCoverImage
                            formData={formData}
                            handleFileChange={handleFileChange}
                        />
                    )}

                    {currentStep === 3 && (
                        <GigAdditionalImages
                            formData={formData}
                            handleMultiFileChange={handleMultiFileChange}
                        />
                    )}

                    {currentStep === 4 && (
                        <GigFeatures
                            formData={formData}
                            handleChange={handleChange}
                            handleMultiSelectChange={handleMultiSelectChange}
                            gigHelpingTypes={gigHelpingTypes}
                            coreFeatures={coreFeatures}
                        />
                    )}

                    {currentStep === 5 && (
                        <GigSearchTags
                            formData={formData}
                            handleAddSearchTag={handleAddSearchTag}
                            handleRemoveSearchTag={handleRemoveSearchTag}
                        />
                    )}

                    <div className="flex justify-between mt-8">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevStep}
                                className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                            >
                                Previous
                            </button>
                        )}
                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                            >
                                Save & Continue
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <ToastContainer
                position="top-right"
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

export default CreateGig;