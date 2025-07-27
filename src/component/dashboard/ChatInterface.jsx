import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

function ChatInterface({ conversationsUsers, setConversationsUsers }) {
    const [selectedChat, setSelectedChat] = useState(null);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/api/messages/${userId}`)
            .then(response => {
                setConversationsUsers(response.data);
                if (response.data.length > 0) {
                    setSelectedChat(response.data[0]);
                }
            })
            .catch(error => {
                console.error('Error fetching conversation users:', error);
                toast.error('Failed to load conversations.');
            });
    }, [userId, setConversationsUsers, navigate]);

    const handleMoreMessages = () => {
        navigate(`/user/messages`);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 h-96 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Chats</h3>
            {conversationsUsers.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No active chats.</p>
            ) : (
                <div className="flex flex-col flex-grow overflow-hidden">
                    <div className="flex-grow overflow-y-auto pr-4">
                        {conversationsUsers.map((chat) => (
                            <div
                                key={chat._id}
                                className={`p-3 rounded-md cursor-pointer mb-2 ${selectedChat && selectedChat._id === chat._id ? 'bg-blue-100 border-blue-400 border' : 'hover:bg-gray-50'}`}
                                onClick={() => navigate(`/user/messages/${chat._id}`)} // Navigate on click
                            >
                                <div className="flex items-center">
                                    <img
                                        src={chat.profilePicture || 'https://placehold.co/40x40/CCCCCC/666666?text=User'}
                                        alt={chat.participantName || chat.username}
                                        className="h-10 w-10 rounded-full object-cover mr-3"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/CCCCCC/666666?text=User'; }}
                                    />
                                    <p className="font-medium text-gray-800">{chat.participantName || chat.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleMoreMessages}
                            className="bg-transparent text-blue-600 hover:text-blue-800 py-2 px-4 rounded-md transition duration-200 border border-blue-600 hover:border-blue-800"
                        >
                            More
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatInterface;