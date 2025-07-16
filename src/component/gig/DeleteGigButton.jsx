import React, { useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

function DeleteGigButton({ gigId, onGigDeleted, btnColor = "bg-red-500 text-white hover:bg-red-600" }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/api/gig/${gigId}`);
            if (onGigDeleted) {
                onGigDeleted(gigId);
            }
            setShowConfirmModal(false);
        } catch (err) {
            console.error('Error deleting gig:', err);
            toast.error(err.response?.data?.message || 'Failed to delete gig.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirmModal(true)}
                className={`px-3 py-1 ${btnColor} rounded-md text-sm transition-colors`}
                disabled={isDeleting}
            >
                {isDeleting ? 'Deleting...' : 'Delete'}
            </button>

            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm to delete</h3>
                        <p className="text-gray-700 mb-6">Are you sure you want to delete this gig? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DeleteGigButton;