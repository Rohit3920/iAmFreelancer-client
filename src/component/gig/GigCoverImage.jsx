import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

function GigCoverImage({ formData, handleFileChange }) {
    const [coverImageUrl, setCoverImageUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (typeof formData.cover === 'string' && formData.cover.startsWith('http')) {
            setCoverImageUrl(formData.cover);
        } else if (formData.cover instanceof File) {
            setCoverImageUrl(null);
        } else {
            setCoverImageUrl(null);
        }
    }, [formData.cover]);

    const uploadImage = async (file) => {
        setIsUploading(true);
        setError('');

        const data = new FormData();
        data.append('image', file);

        try {
            const response = await api.post('/api/file', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const uploadedUrl = response.data.imageUrl;
            setCoverImageUrl(uploadedUrl);
            handleFileChange('cover', uploadedUrl);
            toast.success('Cover image uploaded successfully!');
        } catch (err) {
            console.error('Cover image upload error:', err);
            setError(err.response?.data?.error || 'Failed to upload cover image. Please try again.');
            toast.error('Failed to upload cover image.');
            setCoverImageUrl(null);
            handleFileChange('cover', null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCoverImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            uploadImage(file);
        } else {
            setError('Please select a valid image file (e.g., JPEG, PNG).');
            setCoverImageUrl(null);
            handleFileChange('cover', null);
        }
    };

    return (
        <div>
            <label
                htmlFor="cover"
                className="block text-sm font-semibold text-gray-700 mb-1"
            >
                Upload Cover Image <span className="text-red-500">*</span>
            </label>
            <input
                type="file"
                id="cover"
                name="cover"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isUploading}
            />

            {isUploading && (
                <div className="mt-3 flex justify-center items-center">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="ml-2 text-gray-600">Uploading...</p>
                </div>
            )}

            {coverImageUrl && (
                <div className="mt-3 flex justify-center">
                    <img
                        src={coverImageUrl}
                        alt="Cover Preview"
                        className="w-48 h-48 object-contain rounded-md shadow-md"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/CCCCCC/666666?text=Image+Error'; }}
                    />
                </div>
            )}
            {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
        </div>
    );
}

export default GigCoverImage;