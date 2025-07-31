import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

function GigAdditionalImages({ formData, handleMultiFileChange }) {
    const [additionalImageUrls, setAdditionalImageUrls] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (Array.isArray(formData.images) && formData.images.every(url => typeof url === 'string' && url.startsWith('http'))) {
            setAdditionalImageUrls(formData.images);
            if (currentImageIndex >= formData.images.length && formData.images.length > 0) {
                setCurrentImageIndex(formData.images.length - 1);
            } else if (formData.images.length === 0) {
                setCurrentImageIndex(0);
            }
        } else {
            setAdditionalImageUrls([]);
            setCurrentImageIndex(0);
        }
    }, [formData.images, currentImageIndex]);

    const uploadImage = useCallback(async (file) => {
        if (!file) return null;

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

            setAdditionalImageUrls(prevUrls => {
                const newUrls = [...prevUrls, uploadedUrl];
                const limitedUrls = newUrls.slice(0, 3);
                handleMultiFileChange('images', limitedUrls);
                return limitedUrls;
            });
            toast.success(`Image "${file.name}" uploaded successfully!`);
            return uploadedUrl;
        } catch (err) {
            console.error('Additional image upload error:', err);
            const errorMessage = err.response?.data?.error || `Failed to upload image "${file.name}". Please try again.`;
            setError(prevError => (prevError ? `${prevError}\n${errorMessage}` : errorMessage));
            toast.error(`Failed to upload image "${file.name}".`);
            return null;
        } finally {
            setIsUploading(false);
        }
    }, [handleMultiFileChange]);

    const handleFileSelect = async (e) => {
        const selectedFile = e.target.files[0];
        e.target.value = '';

        if (!selectedFile) {
            setError('No file selected.');
            return;
        }

        if (additionalImageUrls.length >= 3) {
            toast.warn('You can upload a maximum of 3 additional images.');
            setError('Maximum of 3 images already uploaded.');
            return;
        }

        if (!selectedFile.type.startsWith('image/')) {
            setError('Please select a valid image file (e.g., JPEG, PNG).');
            return;
        }

        await uploadImage(selectedFile);
    };

    const removeImage = (urlToRemove) => {
        setAdditionalImageUrls(prevUrls => {
            const newUrls = prevUrls.filter(url => url !== urlToRemove);
            handleMultiFileChange('images', newUrls);
            if (currentImageIndex >= newUrls.length && newUrls.length > 0) {
                setCurrentImageIndex(newUrls.length - 1);
            } else if (newUrls.length === 0) {
                setCurrentImageIndex(0);
            }
            return newUrls;
        });
        toast.info('Image removed.');
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex + 1) % additionalImageUrls.length
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            (prevIndex - 1 + additionalImageUrls.length) % additionalImageUrls.length
        );
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div>
            <label
                className="block text-sm font-semibold text-gray-700 mb-1"
            >
                Additional Images (Max 3) <span className="text-red-500">*</span>
            </label>
            <input
                type="file"
                id="additionalImageInput"
                name="additionalImage"
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="hidden"
            />

            <button
                type="button"
                onClick={triggerFileInput}
                className={`mt-1 px-4 py-2 border rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${additionalImageUrls.length >= 3 || isUploading
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    }`}
                disabled={additionalImageUrls.length >= 3 || isUploading}
            >
                {isUploading ? 'Uploading...' : 'Add Image'}
            </button>

            {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}

            {additionalImageUrls.length > 0 && (
                <div className="mt-3 relative w-full max-w-md mx-auto">
                    <div className="relative h-64 overflow-hidden rounded-lg shadow-md">
                        <img
                            src={additionalImageUrls[currentImageIndex]}
                            alt={`Additional Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x300/CCCCCC/666666?text=Image+Error'; }}
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(additionalImageUrls[currentImageIndex])}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs leading-none"
                            aria-label="Remove current image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {additionalImageUrls.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={prevImage}
                                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full ml-2 focus:outline-none"
                            >
                                &#10094;
                            </button>
                            <button
                                type="button"
                                onClick={nextImage}
                                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full mr-2 focus:outline-none"
                            >
                                &#10095;
                            </button>
                        </>
                    )}
                    <div className="flex justify-center mt-2 space-x-2">
                        {additionalImageUrls.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`w-3 h-3 rounded-full ${idx === currentImageIndex ? 'bg-blue-600' : 'bg-gray-400'}`}
                            ></button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Viewing {currentImageIndex + 1} of {additionalImageUrls.length} images.
                    </p>
                </div>
            )}
            <p className="text-sm text-gray-500 mt-2 text-center">
                {additionalImageUrls.length} of 3 images added.
            </p>
        </div>
    );
}

export default GigAdditionalImages;