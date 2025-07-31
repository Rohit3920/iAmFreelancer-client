import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Journey from '../component/home/recommended/Journey';
import FillDetail from '../component/home/recommended/FillDetail';
import KeepExploring from '../component/home/KeepExploring';
import TopGigs from '../component/home/TopGigs';
import PopularFreelancer from '../component/home/PopularFreelancer';

function Home() {
    const [currentUser, setCurrentUser] = useState();
    const [popularUsers, setPopularUsers] = useState();
    const [popularGig, setPopularGig] = useState();
    const [exploringGig, setExploringGig] = useState();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        async function fetchData() {
            try {
                const userRes = await api.get(`api/auth/${userId}`);
                setCurrentUser(userRes.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setCurrentUser(null);
            }
            try {
                const gigRes = await api.get('/api/gig');
                setExploringGig(gigRes.data.slice(0, 20));
                const sortedGigs = gigRes.data.sort((a, b) => {
                    const ratingA = a.starNumber > 0 ? (a.totalStars / a.starNumber) : 0;
                    const ratingB = b.starNumber > 0 ? (b.totalStars / b.starNumber) : 0;
                    return ratingB - ratingA;
                });
                setPopularGig(sortedGigs.slice(0, 20));
            } catch (err) {
                console.error("Error fetching gig data:", err);
                setPopularGig(null);
            }
            try {
                const usersRes = await api.get(`api/auth/`);
                setPopularUsers(usersRes.data.slice(0, 20));
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        }
        fetchData();
    }, [userId]);

    console.log(popularUsers);

    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased">
            <div
                className="relative bg-cover bg-center h-54 md:h-80 flex flex-col justify-between p-6 rounded-b-lg shadow-md"
                style={{
                    backgroundImage: `url(background.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-blue-900 opacity-75 rounded-b-lg"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <h1 className="text-white text-3xl md:text-4xl font-bold">
                        Welcome back, {currentUser?.username}{currentUser?.userRole === "freelancer" && <small className='text-xs'>( {currentUser?.DomainDetail?.[0]?.freelancerDomain} )</small>}
                    </h1>
                    <span className="text-white text-sm md:text-base italic">Made on <a href='https://rohit3920.github.io/my-portfolio-2.O/' target='_blank' rel="noopener noreferrer">Rohit3920</a></span>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-center items-center gap-4 mt-8 md:mt-0">
                    {currentUser?.userRole === 'user' &&
                        <Journey userData={currentUser} />
                    }
                    <FillDetail />
                </div>
            </div>

            <KeepExploring exploringGig={exploringGig} />
            <PopularFreelancer popularUsers={popularUsers} />
            <TopGigs popularGig={popularGig} />
        </div>
    );
}

export default Home;