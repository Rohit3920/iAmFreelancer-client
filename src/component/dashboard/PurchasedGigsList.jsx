import React from 'react';
import { useNavigate } from 'react-router-dom';

function PurchasedGigsList({ gigs }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white shadow-lg overflow-y-scroll overflow-x-hidden h-96 rounded-lg p-6">
            {gigs.length === 0 ? (
                <p className="text-gray-600 text-center py-4">You haven't purchased any gigs yet.</p>
            ) : (
                <div className="space-y-4">
                    {gigs.map((gig) => (
                        <div key={gig._id} className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{gig.gigId?.title || 'Unknown Gig'}</h3>
                                <p className="text-sm text-gray-600">Seller: {gig.freelancerId?.username || 'N/A'}</p>
                                <p className="text-sm text-gray-600">Status: <span className={`font-medium ${
                                    gig.status === 'pending' ? 'text-yellow-600' :
                                    gig.status === 'in-progress' ? 'text-blue-600':
                                    gig.status === 'completed' ? 'text-green-600' :
                                    'text-gray-600'
                                    }`}>{gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}</span></p>
                            </div>
                            <button onClick={() => { navigate(`/view-order/${gig._id}`); }} className="bg-purple-500 hover:bg-purple-600 text-white text-sm py-2 px-4 rounded-md transition duration-200">
                                View Order
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PurchasedGigsList;
