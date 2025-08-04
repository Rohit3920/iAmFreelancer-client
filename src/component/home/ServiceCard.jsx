import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '.././../utils/api';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ServiceCard = ({ gig }) => {
    const {
        title,
        price,
        totalStars,
        starNumber,
        images,
        userId
    } = gig;

    const currentUserId = localStorage.getItem('userId');

    const [isLiked, setIsLiked] = useState(false);
    const [currentLikesCount, setCurrentLikesCount] = useState(0);

    useEffect(() => {
        if (gig && gig.like && currentUserId) {
            const liked = gig.like.some(likedUserId => likedUserId.toString() === currentUserId);
            setIsLiked(liked);
            setCurrentLikesCount(gig.like.length);
        }
    }, [gig, currentUserId]);

    const handleLikeUnlike = async () => {
        if (!currentUserId) {
            console.error("User not authenticated. Cannot perform like/unlike action.");
            return;
        }

        try {
            let res;
            const payload = { userId: currentUserId };

            if (isLiked) {
                res = await api.delete(`/api/like/gig/${gig._id}/${currentUserId}`);
            } else {
                res = await api.post(`/api/like/gig/${gig._id}`, payload);
            }

            if (res.status === 200) {
                setIsLiked(!isLiked);
                setCurrentLikesCount(res.data.likesCount);
                console.log(res.data.message);
            } else {
                console.error("API call failed:", res.data.error || res.statusText);
            }
        } catch (error) {
            console.error("Error during like/unlike operation:", error.response ? error.response.data : error.message);
        }
    };

    const rating = starNumber > 0 ? (totalStars / starNumber).toFixed(1) : '0.0';
    const comment = starNumber;
    const imagesToDisplay = (images && images.length > 0)
        ? gig.images
        : (gig.cover ? [gig.cover] : []);

    const sellerName = userId?.username ? userId.username.slice(0, 20) : 'Unknown Seller';
    const sellerLevel = "Level 1";
    const sellerImage = userId?.profilePicture || 'https://placehold.co/50x50/CCCCCC/000000?text=User';

    return (
        <div className="flex-shrink-0 w-70 m-4 rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition duration-200">
            <div className="relative">
                <div className="mb-8">
                    {imagesToDisplay.length > 0 ? (
                        <Carousel
                            showArrows={true}
                            showStatus={false}
                            showIndicators={true}
                            showThumbs={false}
                            infiniteLoop={true}
                            autoPlay={false}
                            interval={500}
                            transitionTime={1500}
                            swipeable={true}
                            emulateTouch={true}
                            stopOnHover={true}
                            className="rounded-lg shadow-xl overflow-hidden border border-gray-200"
                        >
                            {imagesToDisplay.map((image, index) => (
                                <div key={index} className="h-40 w-full flex items-center justify-center bg-gray-100">
                                    <img
                                        src={image}
                                        alt={`Gig Image ${index + 1}`}
                                        className="h-full object-contain w-full"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/900x500/E0E0E0/666666?text=Image+Error'; }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    ) : (
                        <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg shadow-md border border-gray-200 text-gray-500 text-lg">
                            No images available for this gig.
                        </div>
                    )}
                </div>
                <div
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md cursor-pointer z-10"
                    onClick={handleLikeUnlike}
                >
                    <svg
                        className={`w-5 h-5 ${isLiked ? 'text-red-500' : 'text-gray-700'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center mb-3">
                    <img
                        src={sellerImage}
                        alt={sellerName}
                        className="w-10 h-10 rounded-full mr-3 border-2 border-blue-500"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x50/CCCCCC/000000?text=User'; }}
                    />
                    <div>
                        <Link to={`/view-user-profile/${userId._id}`}><p className="font-semibold text-gray-800">{sellerName}</p></Link>
                        <p className="text-sm text-gray-500 text-left">{sellerLevel}</p>
                    </div>
                </div>

                <Link to={`/view-gig/${gig._id}`}>
                    <h3 className="text-lg font-medium text-gray-500 mb-2 line-clamp-2">
                        {title.slice(0, 27)}...
                    </h3>
                </Link>

                <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-800 font-bold mr-1">{comment}</span>
                    <span className="text-gray-500">({rating})</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="text-gray-600">
                        From <span className="text-lg font-bold text-gray-900">${price}</span>
                    </div>
                    <div className="text-gray-600 flex items-center">
                        <span className="font-semibold text-gray-900 mr-1">{currentLikesCount}</span>
                        Likes
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
