import React, { useState, useRef, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function UploadProfile({ nextClick , prevClick  }) {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadMessage, setUploadMessage] = useState('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const userId = localStorage.getItem('userId');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setImageUrl('');
            setUploadMessage('');
            setError('');
            handleUpload(file);
        } else {
            setSelectedFile(null);
            setError('Please select a valid image file (e.g., JPEG, PNG).');
        }
    };

    useEffect(() => {
        if (userId) {
            api.get(`/api/auth/${userId}`)
                .then(response => {
                    if (response.data.profilePicture) {
                        setImageUrl(response.data.profilePicture);
                    }
                })
                .catch(err => {
                    console.error('Error fetching profile picture:', err);
                    setError('Failed to load profile picture.');
                });
        }
    }, [userId]);

    const handleUpload = async (fileToUpload = selectedFile) => {
        if (!fileToUpload) {
            setError('Please select an image to upload.');
            return;
        }

        setIsUploading(true);
        setUploadMessage('Uploading...');
        setError('');

        const formData = new FormData();
        formData.append('image', fileToUpload);

        try {
            const response = await api.post('/api/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.imageUrl);
            setUploadMessage('Upload successful!');
            toast.success('Image uploaded successfully!');
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.error || 'Failed to upload image. Please try again.');
            setUploadMessage('');
            toast.error('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageUrl) {
            setError('No profile picture to submit.');
            return;
        }

        try {
            await api.put(`/api/auth/${userId}`, { profilePicture: imageUrl });
            console.log('Submitted Profile Picture URL:', imageUrl);
            const done = toast.success('Profile picture updated successfully!');
            if (done && nextClick) {
                nextClick();
            }else if( done && !prevClick) {
                navigate('/profile');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setError('Failed to update profile picture. Please try again.');
            toast.error('Failed to update profile picture.');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-70 flex items-center justify-center p-4 font-sans z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative text-gray-900">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Profile photo</h2>
                    <button className="text-gray-500 hover:text-gray-900 transition-colors duration-200" onClick={prevClick? prevClick : () => navigate('/profile')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center p-8">
                    <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-gray-200 shadow-lg">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/CCCCCC/666666?text=Image+Error'; }}
                            />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-600 text-center text-sm mt-4">{error}</p>}
                    {uploadMessage && !isUploading && <p className="text-green-600 text-center text-sm mt-4">{uploadMessage}</p>}
                </div>

                <div className="flex justify-around items-center p-4 border-t border-gray-200">
                    <button
                        className="flex flex-col items-center text-gray-500 hover:text-gray-900 transition-colors duration-200 p-2 rounded-lg"
                        onClick={triggerFileInput}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">Add photo</span>
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={!imageUrl}
                        className={`w-full py-2 rounded-lg font-bold text-white transition duration-300 ease-in-out
                            ${!imageUrl
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg'
                            }`}
                    >
                        Save Profile Picture
                    </button>
                    <button type="button" onClick={nextClick} className="w-full py-2 mt-5 rounded-lg font-bold text-white bg-blue-400 hover:bg-blue-500 transition duration-300 ease-in-out">
                        Skip
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UploadProfile;