import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AddressDetails from './detailsForm/AddressDetails.jsx';
import BasicDetails from './detailsForm/BasicDetails.jsx';
import DomainDetails from './detailsForm/DomainDetails.jsx';
import EducationDetails from './detailsForm/EducationDetails.jsx';

function Detail() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [allFormData, setAllFormData] = useState({
        basic: {},
        address: {},
        education: {},
        DomainDetail: {},
    });

    console.log(allFormData);
    const basicDetailsRef = useRef(null);
    const addressDetailsRef = useRef(null);
    const educationDetailsRef = useRef(null);
    const domainDetailsRef = useRef(null);

    const handlePreviousClick = () => {
        setCurrentStep(currentStep - 1);
        toast.info(`Mapsd back to Step ${currentStep - 1}.`);
    };

    const handleNextClick = () => {
        setCurrentStep(currentStep + 1);
        toast.info(`Mapsd next to Step ${currentStep + 1}.`);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Complete Your Profile</h1>

            <div className="flex justify-center mb-8 w-full max-w-4xl">
                <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-400'}`}>1</div>
                    <div className={`flex-1 h-1 w-20 mx-2 ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-400'}`}>2</div>
                    <div className={`flex-1 h-1 w-20 mx-2 ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-400'}`}>3</div>
                    <div className={`flex-1 h-1 w-20 mx-2 ${currentStep > 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-400'}`}>4</div>
                </div>
            </div>

            {currentStep === 1 && (
                <BasicDetails
                    ref={basicDetailsRef}
                    nextClick={handleNextClick}
                />
            )}

            {currentStep === 2 && (
                <AddressDetails
                    ref={addressDetailsRef}
                    nextClick={handleNextClick}
                />
            )}

            {currentStep === 3 && (
                <EducationDetails
                    ref={educationDetailsRef}
                    nextClick={handleNextClick}
                />
            )}

            {currentStep === 4 && (
                <DomainDetails
                    ref={domainDetailsRef}
                    nextClick={handleNextClick}
                />
            )}

            {currentStep > 4 && (
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
                            navigate('/profile');
                            toast.info('go to profile');
                        }}
                        className="py-2 px-6 bg-blue-600 text-white font-bold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                    >
                        Go To Profile
                    </button>
                </div>
            )}

            {currentStep <= 4 && (
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
                    {currentStep === 1 && <div className="w-auto"></div>} {/* Spacer for step 1 */}

                    <button
                        type="button"
                        onClick={handleNextClick}
                        className="py-2 px-6 bg-lime-600 text-white font-bold rounded-md shadow-lg hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 transition duration-150 ease-in-out text-lg"
                    >
                        {currentStep === 4 ? 'Submit All Details' : 'Next'}
                    </button>
                </div>
            )}

            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default Detail;