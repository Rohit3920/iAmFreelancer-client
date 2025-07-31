import React from 'react'
import { useNavigate } from 'react-router-dom'

function FillDetail() {
    const navigate = useNavigate();
const goToEditProfile = () =>{
        navigate('/upload-profile')
}

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center w-full max-w-sm md:max-w-md lg:max-w-lg">
            <div className="flex-shrink-0 mr-4"><svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-1.28-8.455-3.325A1.993 1.993 0 003 14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2 0-.276-.06-.539-.172-.782zM12 10a3 3 0 100-6 3 3 0 000 6z"
                />
            </svg>
            </div>
            <div className="flex-grow text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-800">
                    Tailor Freelancer to your needs
                </h3>
                <p className="text-sm text-gray-600">
                    Complete your profile.
                </p>
            </div>
            <button onClick={goToEditProfile} className="mt-4 md:mt-0 md:ml-4 bg-transparent border border-gray-400 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-100 transition duration-200">
                Add info
            </button>
        </div>
    )
}

export default FillDetail
