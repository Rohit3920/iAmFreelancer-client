import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, MessageSquare, Clock, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [viewBasic, setViewBasic] = useState(false);
    const [viewAddress, setViewAddress] = useState(false);
    const [viewEducation, setViewEducation] = useState(false);
    const [viewDomainDetail, setViewDomainDetail] = useState(false);
    // const [view, setView] = useState({
    //     basic: false,
    //     address: false,
    //     education: false,
    //     domainDetail: false,
    // });
    const userId = localStorage.getItem('userId');

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
        const ok = confirm('Are you sure you want to change your profile picture?');
        if (!ok) return;
        navigate('/upload-profile')
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
        <div className="min-h-screen bg-gray-100 font-sans antialiased">
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/4 bg-white rounded-xl shadow-md p-6 flex flex-col items-center md:items-start">
                        <div className="mb-4">
                            <img
                                src={user.profilePicture}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <button onClick={changeProfilePicture} className='text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200'>Edit profile picture</button>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1 text-center md:text-left">
                            {user.username}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4 text-center md:text-left">
                            {user.email}
                        </p>

                        <div className="w-full space-y-3 text-gray-700">
                            <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                <span>Located in {user.location}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                <span>Joined in {user.createdAt}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <MessageSquare className="h-4 w-4 text-gray-500 mr-2" />
                                <span>{user.language} <small>(Conversational)</small></span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                <span>Preferred working hours: {user.preferredWorkingHours}</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-3/4">
                        <nav className="text-sm text-gray-500 mb-6">
                            Home <ChevronRight className="inline-block h-3 w-3 mx-1" /> My Profile
                        </nav>

                        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Hi! I'm {user.username}, 👋 Let's help freelancers get to know you
                            </h1>
                            <p className="text-gray-600">
                                {user.description ? user.description : 'Get the most out of iAmFreelancer by sharing a bit more about yourself and how you prefer to work with freelancers.'}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Details</h3>

                            {userData.basic && userData.basic.length > 0 && (
                                <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50 shadow-sm">
                                    <h4 onClick={() => { setViewBasic(!viewBasic) }} className="text-md font-semibold text-blue-800 cursor-pointer mb-2">Basic Information</h4>
                                    {
                                        viewBasic &&
                                        <div className="text-sm text-gray-700">
                                            <p className="text-sm text-gray-700"><strong>Date of Birth:</strong> {new Date(userData.basic[0].dob).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-700"><strong>Gender:</strong> {userData.basic[0].gender}</p>
                                            <p className="text-sm text-gray-700"><strong>Languages:</strong> {userData.basic[0].language.join(', ')}</p>
                                            <p className="text-sm text-gray-700"><strong>Contact No:</strong> {userData.basic[0].contactNo}</p>
                                        </div>
                                    }
                                </div>
                            )}

                            {userData.DomainDetail && userData.DomainDetail.length > 0 && (
                                <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50 shadow-sm">
                                    <h4 onClick={() => { setViewDomainDetail(!viewDomainDetail) }} className="text-md font-semibold cursor-pointer text-green-800 mb-2">Domain Details</h4>
                                    {
                                        viewDomainDetail &&
                                        <div className="text-sm text-gray-700">
                                            <p className="text-sm text-gray-700"><strong>Freelancer Domain:</strong> {userData.DomainDetail[0].freelancerDomain}</p>
                                            <p className="text-sm text-gray-700"><strong>Experience:</strong> {userData.DomainDetail[0].domainExperience} years</p>
                                            <p className="text-sm text-gray-700"><strong>Technologies:</strong> {userData.DomainDetail[0].technologies.join(', ')}</p>
                                            <p className="text-sm text-gray-700"><strong>Description:</strong> {userData.DomainDetail[0].description}</p>
                                        </div>
                                    }
                                </div>
                            )}

                            {userData.education && userData.education.length > 0 && (
                                <div className="mb-6 p-4 border border-purple-200 rounded-lg bg-purple-50 shadow-sm">
                                    <h4 onClick={() => { setViewEducation(!viewEducation) }} className="text-md font-semibold cursor-pointer text-purple-800 mb-2">Education</h4>
                                    {
                                        viewEducation &&
                                        <div>
                                            <p className="text-sm text-gray-700"><strong>Institution:</strong> {userData.education[0].institutionName}</p>
                                            <p className="text-sm text-gray-700"><strong>Degree:</strong> {userData.education[0].degree}</p>
                                            <p className="text-sm text-gray-700"><strong>Field of Study:</strong> {userData.education[0].fieldOfStudy}</p>
                                            <p className="text-sm text-gray-700"><strong>Graduation Year:</strong> {new Date(userData.education[0].graduationYear).getFullYear()}</p>
                                            <p className="text-sm text-gray-700"><strong>Description:</strong> {userData.education[0].description}</p>
                                        </div>
                                    }
                                </div>
                            )}

                            {userData.address && userData.address.length > 0 && (
                                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 shadow-sm">
                                    <h4 onClick={() => { setViewAddress(!viewAddress) }} className="text-md font-semibold cursor-pointer text-yellow-800 mb-2">Address Information</h4>
                                    {
                                        viewAddress &&
                                        <div>
                                            <p className="text-sm text-gray-700"><strong>Street:</strong> {userData.address[0].street}</p>
                                            <p className="text-sm text-gray-700"><strong>City:</strong> {userData.address[0].city}</p>
                                            <p className="text-sm text-gray-700"><strong>State:</strong> {userData.address[0].state}</p>
                                            <p className="text-sm text-gray-700"><strong>Zip/Postal/pin Code:</strong> {userData.address[0].zipCode}</p>
                                            <p className="text-sm text-gray-700"><strong>Country:</strong> {userData.address[0].country}</p>
                                            <p className="text-sm text-gray-700"><strong>Address Type:</strong> {userData.address[0].addressType}</p>
                                        </div>
                                    }

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={() => { navigate('/details') }} className='bg-blue-500 hover:bg-blue-600 text-white mb-12 font-bold py-2 px-4 rounded'>
                Edit Profile
            </button>
        </div>
    );
}

export default Profile;