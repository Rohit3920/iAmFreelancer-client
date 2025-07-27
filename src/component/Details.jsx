import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AddressDetails from './detailsForm/AddressDetails.jsx';
import BasicDetails from './detailsForm/BasicDetails.jsx';
import DomainDetails from './detailsForm/DomainDetails.jsx';
import EducationDetails from './detailsForm/EducationDetails.jsx';
import UploadProfile from './detailsForm/UploadProfile.jsx';
import api from '../utils/api';

function Detail() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const userId = localStorage.getItem('userId');
    const [userRole, setUserRole] = useState();
    const [allFormData, setAllFormData] = useState({
        basic: {},
        address: {},
        education: {},
        DomainDetail: {},
    });

    const totalSteps = userRole === 'freelancer' ? 5 : 4;

    useEffect(() => {
        if (userId) {
            api.get(`/api/auth/${userId}`)
                .then(response => {
                    setUserRole(response.data.userRole)
                    if (response.data) {
                        setAllFormData(() => ({
                            basic: response.data.basic[0] || {},
                            address: response.data.address[0] || {},
                            education: response.data.education[0] || {},
                            DomainDetail: response.data.DomainDetail[0] || {},
                        }));
                    }
                })
                .catch(err => {
                    console.error('Error fetching profile data:', err);
                    toast.error('Failed to load profile data.');
                });
        }
    }, [userId]);

    const handlePreviousClick = () => {
        setCurrentStep(prevStep => Math.max(1, prevStep - 1));
        toast.info(`Moved back to Step ${currentStep - 1}.`);
    };

    const handleNextClick = () => {
        setCurrentStep(prevStep => Math.min(totalSteps + 1, prevStep + 1));
        if (currentStep < totalSteps) {
            toast.info(`Moved next to Step ${currentStep + 1}.`);
        }
    };

    const formComponents = {
        1: UploadProfile,
        2: EducationDetails,
        3: BasicDetails,
        4: AddressDetails,
        5: DomainDetails,
    };

    const renderFormComponent = () => {
        const CurrentFormComponent = formComponents[currentStep];

        if (!CurrentFormComponent) return null;

        const commonProps = {
            nextClick: handleNextClick,
            prevClick: handlePreviousClick,
        };

        switch (currentStep) {
            case 1:
                return <UploadProfile {...commonProps} />;
            case 2:
                return <EducationDetails myFormData={allFormData.education} {...commonProps} />;
            case 3:
                return <BasicDetails myFormData={allFormData.basic} {...commonProps} />;
            case 4:
                return <AddressDetails myFormData={allFormData.address} {...commonProps} />;
            case 5:
                return userRole === 'freelancer' && <DomainDetails myFormData={allFormData.DomainDetail} {...commonProps} />;
            default:
                return null;
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Complete Your Profile</h1>

            <div className="flex justify-center mb-8 w-full max-w-4xl">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <React.Fragment key={index}>
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${currentStep >= (index + 1) ? 'bg-blue-600' : 'bg-gray-400'}`}>
                                {index + 1}
                            </div>
                            {index < totalSteps - 1 && (
                                <div className={`flex-1 h-1 w-20 mx-2 ${currentStep > (index + 1) ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {renderFormComponent()}


            {currentStep > totalSteps && (
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-4xl border border-gray-200 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">All Forms Completed!</h2>
                    <p className="text-gray-600 mb-6">Thank you for providing your details. Your profile is now complete.</p>
                    <button
                        onClick={() => {
                            setCurrentStep(1);
                            setAllFormData({
                                basic: {},
                                address: {},
                                education: {},
                                DomainDetail: {},
                            });
                            navigate(`/profile/${userId}`);
                            toast.success('Redirecting to your profile!');
                        }}
                        className="py-2 px-6 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                        Go To Profile
                    </button>
                </div>
            )}

            {currentStep <= totalSteps && (
                <div className="flex justify-between w-full max-w-4xl mt-6">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handlePreviousClick}
                            className="py-2 px-6 bg-lime-500 text-white font-bold rounded-md shadow-lg hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 transition duration-150 ease-in-out text-lg"
                        >
                            Previous
                        </button>
                    )}
                    {currentStep === 1 && <div className="w-auto"></div>}

                    <button
                        type="button"
                        onClick={handleNextClick}
                        className="py-2 px-6 bg-lime-600 text-white font-bold rounded-md shadow-lg hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 transition duration-150 ease-in-out text-lg"
                    >
                        {currentStep === totalSteps ? 'Submit All Details' : 'Next'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default Detail;