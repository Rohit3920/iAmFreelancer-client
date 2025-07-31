import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Mail, Briefcase, MapPin, GraduationCap, Code, User } from 'lucide-react';

const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        console.error(e);
        return 'Invalid Date';
    }
};

const calculateExperience = (years) => {
    if (typeof years !== 'number' || isNaN(years)) return 'Not set';
    if (years === 0) return 'Less than 1 year';
    if (years === 1) return '1 year';
    return `${years} years`;
};

function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loggedInUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/auth/${userId}`);
                setUserProfile(response.data);
            } catch (err) {
                setError("Failed to load user profile. Please try again later.", err);
                toast.error("Failed to load user profile.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const handleMessageUser = () => {
        if (!loggedInUserId) {
            toast.info("Please log in to send messages.");
            navigate('/login');
            return;
        }
        navigate(`/user/messages/${userId}`);
    };

    const handleViewGigs = () => {
        toast.info(`Navigating to view gigs by ${userProfile?.username || 'this user'}...`);
        navigate(`/view-gigs/${userId}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-4 text-lg text-gray-700">Loading user profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-red-600 text-lg">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-gray-700 text-lg">
                <p>User profile not found.</p>
                <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Go Home
                </Link>
            </div>
        );
    }

    const isOwnProfile = loggedInUserId === userId;

    const profileDescription = userProfile.DomainDetail && userProfile.DomainDetail.length > 0 && userProfile.DomainDetail[0].description
        ? userProfile.DomainDetail[0].description
        : 'No description available.';

    return (
        <div className="min-h-screen w-full bg-gray-100 py-8 px-0 sm:px-6 lg:px-8 flex justify-center items-start">
            <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden md:flex">
                <div className="md:flex-shrink-0 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col items-center justify-center relative">
                    <div className="relative mb-4">
                        <img
                            className="h-60 w-60 rounded-full object-cover border-4 border-white shadow-md"
                            src={userProfile.profilePicture || 'https://placehold.co/128x128/CCCCCC/666666?text=User'}
                            alt={`${userProfile.username}'s profile`}
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/CCCCCC/666666?text=User'; }}
                        />
                    </div>
                    <h1 className="text-3xl font-bold mb-1 text-center">{userProfile.username}</h1>
                    <p className="text-blue-100 text-lg mb-2 capitalize text-center">
                        ( {userProfile.userRole} {userProfile.DomainDetail && userProfile.DomainDetail.length > 0 && userProfile.DomainDetail[0].freelancerDomain ? `~ ${userProfile.DomainDetail[0].freelancerDomain}` : ''})
                    </p>

                    <p className="text-blue-200 text-sm italic mb-4 text-center px-4">
                        {profileDescription}
                    </p>

                    {!isOwnProfile && (
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
                            <button
                                onClick={handleMessageUser}
                                className="flex items-center justify-center px-5 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-md w-full sm:w-auto"
                            >
                                <Mail className="w-5 h-5 mr-2" /> Message
                            </button>
                            {
                                userProfile.userRole === 'freelancer' &&
                                <button
                                    onClick={handleViewGigs}
                                    className="flex items-center justify-center px-5 py-2 bg-white text-indigo-700 rounded-full font-semibold hover:bg-indigo-50 transition-colors shadow-md w-full sm:w-auto"
                                >
                                    <Briefcase className="w-5 h-5 mr-2" /> View Gigs
                                </button>
                            }
                        </div>
                    )}

                    <div>
                        {userProfile.basic && userProfile.basic.length > 0 && (
                            <div className="mb-8 p-4 mt-4 text-white rounded-lg shadow-sm text-center">
                                {userProfile.basic.map((basicInfo, index) => (
                                    <div key={index} className="text-left">
                                        <p className='text-sm italic'><strong className="font-medium">Date of Birth:</strong> {formatDate(basicInfo.dob)}</p>
                                        <p className='text-sm italic'><strong className="font-medium">Gender:</strong> {basicInfo.gender || 'Not set'}</p>
                                        <p className='text-sm italic'><strong className="font-medium">Languages:</strong> {basicInfo.language && basicInfo.language.length > 0 ? basicInfo.language.join(', ') : 'Not set'}</p>
                                        <p className='text-sm italic'><strong className="font-medium">Contact No:</strong> {basicInfo.contactNo || 'Not set'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 flex-grow">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">User Details</h2>

                    {userProfile.userRole === 'freelancer' && userProfile.DomainDetail && userProfile.DomainDetail.length > 0 && (
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><Code className="w-6 h-6 mr-2 text-purple-500" /> Professional Domain</h3>
                            {userProfile.DomainDetail.map((domain, index) => (
                                <div key={index} className="space-y-3">
                                    <p><strong className="font-medium">Domain:</strong> {domain.freelancerDomain || 'Not set'}</p>
                                    <p><strong className="font-medium">Experience:</strong> {calculateExperience(domain.domainExperience)}</p>
                                    <p><strong className="font-medium">Technologies:</strong> {domain.technologies && domain.technologies.length > 0 ? domain.technologies.join(', ') : 'Not set'}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {userProfile.education && userProfile.education.length > 0 && (
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><GraduationCap className="w-6 h-6 mr-2 text-green-500" /> Education</h3>
                            {userProfile.education.map((edu, index) => (
                                <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                                    <p><strong className="font-medium">Institution:</strong> {edu.institutionName || 'Not set'}</p>
                                    <p><strong className="font-medium">Degree:</strong> {edu.degree || 'Not set'}</p>
                                    <p><strong className="font-medium">Field of Study:</strong> {edu.fieldOfStudy || 'Not set'}</p>
                                    <p><strong className="font-medium">Graduation Year:</strong> {edu.graduationYear ? new Date(edu.graduationYear).getFullYear() : 'Not set'}</p>
                                    <p><strong className="font-medium">Percentage/GPA:</strong> {edu.percentage !== undefined ? `${edu.percentage}%` : 'Not set'}</p>
                                    <p className="text-gray-600 mt-2 text-sm">{edu.description || 'Not set'}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {userProfile.address && userProfile.address.length > 0 && (
                        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><MapPin className="w-6 h-6 mr-2 text-red-500" /> Addresses</h3>
                            {userProfile.address.map((addr, index) => (
                                <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                                    <p><strong className="font-medium">Type:</strong> {addr.addressType || 'Not set'}</p>
                                    <p><strong className="font-medium">Street:</strong> {addr.street || 'Not set'}</p>
                                    <p><strong className="font-medium">City:</strong> {addr.city || 'Not set'}</p>
                                    <p><strong className="font-medium">State:</strong> {addr.state || 'Not set'}</p>
                                    <p><strong className="font-medium">Zip Code:</strong> {addr.zipCode || 'Not set'}</p>
                                    <p><strong className="font-medium">Country:</strong> {addr.country || 'Not set'}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
                        <p>
                            <strong className="font-medium">Member Since:</strong> {formatDate(userProfile.createdAt)}
                        </p>
                        <p>
                            <strong className="font-medium">Last Updated:</strong> {formatDate(userProfile.updatedAt)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;