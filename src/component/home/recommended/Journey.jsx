import React, { useState } from 'react'
import api from '../../../utils/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function Journey({userData}) {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userRole : 'freelancer'
    })

    const changeUserRole = async () =>{
        setFormData(userData.userRole == 'user' ? 'freelancer' : 'user')
        await api.put(`/api/auth/${userData._id}`, formData )
        .then(res =>{
            toast.success("Wel-come to the team for ", res.data.userRole)
        })
        .catch(error => console.log(error))

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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
            </svg>
            </div>
            <div className="flex-grow text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-800">
                    Get start your journey
                </h3>
                <p className="text-sm text-gray-600">
                    Get tailored offers for your needs.
                </p>
            </div>
            <button onClick={changeUserRole} className="mt-4 md:mt-0 md:ml-4 bg-transparent border border-gray-400 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-100 transition duration-200">
                Get started
            </button>
        </div>
    )
}

export default Journey
