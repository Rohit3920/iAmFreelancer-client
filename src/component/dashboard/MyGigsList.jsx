import React from 'react';
import { useNavigate } from 'react-router-dom';

function MyGigsList({ gigs }) {
    const navigate = useNavigate();

    const handleViewEditClick = (gigId) => {
        navigate(`/view-gig/${gigId}`);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            {gigs.length === 0 ? (
                <p className="text-gray-600 text-center py-4">You haven't created any gigs yet.</p>
            ) : (
                <div className="space-y-4">
                    {gigs.map((gig) => (
                        <div key={gig._id} className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{gig.title}</h3>
                                <p className="text-sm text-gray-600">Status: <span className={`font-medium ${gig.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>{gig.status}</span></p>
                            </div>
                            <button
                                onClick={() => handleViewEditClick(gig._id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded-md transition duration-200"
                            >
                                View/Edit
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyGigsList;