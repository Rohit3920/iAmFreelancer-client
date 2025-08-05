import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, MessageSquare, Clock } from 'lucide-react';
import api from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function Profile() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const validId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            api.get(`api/auth/${userId}`)
                .then(res => {
                    setUserData(res.data);
                })
                .catch(err => {
                    console.error("Error fetching user data:", err);
                });
        }
    }, [userId]);

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-600">Loading profile data...</p>
            </div>
        );
    }

    const changeProfilePicture = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to change your profile picture?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/upload-profile');
            }
        });
    };

    const user = {
        username: userData.username,
        email: userData.email,
        description: userData.DomainDetail && userData.DomainDetail.length > 0 ? userData.DomainDetail[0].description : '',
        profilePicture: userData.profilePicture || 'https://jrursuvjlrsjqmaqizto.supabase.co/storage/v1/object/public/freelancer/public/1752420006413-pt1lh617xzr.jpg',
        location: userData.address && userData.address.length > 0 ? `${userData.address[0].city}, ${userData.address[0].state}, ${userData.address[0].country}` : 'Not set',
        createdAt: new Date(userData.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        language: userData.basic && userData.basic.length > 0 && userData.basic[0].language ? userData.basic[0].language.join(', ') : 'Not set',
        preferredWorkingHours: 'Not set'
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans antialiased">
            <div className="container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4 bg-white rounded-xl shadow-md p-6 flex flex-col items-center md:items-start h-fit md:h-auto md:sticky md:top-8">
                    <div className="mb-4 relative">
                        <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        {
                            validId === userId && (
                                <button onClick={changeProfilePicture} className='text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200'>Edit profile picture</button>
                            )
                        }
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1 text-center md:text-left">
                        {user.username}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4 text-center md:text-left">
                        {user.email}
                    </p>
                    <div className="w-full space-y-3 text-gray-700">
                        <div className="flex items-start text-left text-sm">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                            <span>Located in {user.location}</span>
                        </div>
                        <div className="flex items-start text-left text-sm">
                            <Calendar className="h-4 w-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                            <span>Joined in {user.createdAt}</span>
                        </div>
                        <div className="flex items-start text-left text-sm">
                            <MessageSquare className="h-4 w-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                            <span>{user.language} <small>(Conversational)</small></span>
                        </div>
                        <div className="flex items-start text-left text-sm">
                            <Clock className="h-4 w-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                            <span>Preferred working hours: {user.preferredWorkingHours}</span>
                        </div>
                    </div>
                    {
                        validId === userId && (
                            <button onClick={() => { navigate('/details') }} className='bg-blue-500 hover:bg-blue-600 text-white mt-8 font-bold py-2 px-6 rounded-full transition-colors w-full'>
                                Edit Profile
                            </button>
                        )
                    }
                </div>
                <div className="w-full md:w-3/4 overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        {
                            userData.userRole === 'freelancer' ?
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    Hi! I'm {user.username}, 👋 Let's help freelancers get to know you
                                </h1>
                                :
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                    Hi! Mr/Miss {user.username}, 👋 Freelancers will always help you.
                                </h1>
                        }
                        <p className="text-gray-600">
                            {user.description ? user.description : 'Get the most out of iAmFreelancer by sharing a bit more about yourself and how you prefer to work with freelancers.'}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Details</h3>
                        {userData.basic && userData.basic.length > 0 && (
                            <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50 shadow-sm">
                                <h4 className="text-md font-semibold text-blue-800 mb-2">Basic Information</h4>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <div className="flex justify-between py-1 border-b border-blue-100">
                                        <strong>Date of Birth:</strong>
                                        <span>{new Date(userData.basic[0].dob).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-blue-100">
                                        <strong>Gender:</strong>
                                        <span>{userData.basic[0].gender}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-blue-100">
                                        <strong>Languages:</strong>
                                        <span>{userData.basic[0].language.join(', ')}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <strong>Contact No:</strong>
                                        <span>{userData.basic[0].contactNo}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {userData.DomainDetail && userData.DomainDetail.length > 0 && (
                            <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50 shadow-sm">
                                <h4 className="text-md font-semibold text-green-800 mb-2">Domain Details</h4>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <div className="flex justify-between py-1 border-b border-green-100">
                                        <strong>Freelancer Domain:</strong>
                                        <span>{userData.DomainDetail[0].freelancerDomain}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-green-100">
                                        <strong>Experience:</strong>
                                        <span>{userData.DomainDetail[0].domainExperience} years</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-green-100">
                                        <strong>Technologies:</strong>
                                        <span>{userData.DomainDetail[0].technologies.join(', ')}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {userData.education && userData.education.length > 0 && (
                            <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50 shadow-sm">
                                <h4 className="text-md font-semibold text-purple-800 mb-2">Education</h4>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <div className="flex justify-between py-1 border-b border-purple-100">
                                        <strong>Institution:</strong>
                                        <span>{userData.education[0].institutionName}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-purple-100">
                                        <strong>Degree:</strong>
                                        <span>{userData.education[0].degree}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-purple-100">
                                        <strong>Field of Study:</strong>
                                        <span>{userData.education[0].fieldOfStudy}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-purple-100">
                                        <strong>Graduation Year:</strong>
                                        <span>{new Date(userData.education[0].graduationYear).getFullYear()}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <strong>Description:</strong>
                                        <span>{userData.education[0].description}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {userData.address && userData.address.length > 0 && (
                            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 shadow-sm">
                                <h4 className="text-md font-semibold text-yellow-800 mb-2">Address Information</h4>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <div className="flex justify-between py-1 border-b border-yellow-100">
                                        <strong>Street:</strong>
                                        <span>{userData.address[0].street}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-yellow-100">
                                        <strong>City:</strong>
                                        <span>{userData.address[0].city}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-yellow-100">
                                        <strong>State:</strong>
                                        <span>{userData.address[0].state}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-yellow-100">
                                        <strong>Zip/Postal/pin Code:</strong>
                                        <span>{userData.address[0].zipCode}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <strong>Country:</strong>
                                        <span>{userData.address[0].country}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;