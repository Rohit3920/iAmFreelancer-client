import React from 'react'

function Home() {
    const react_vite_url = import.meta.env.REACT_URL;
    return (
        <div className='text-center mx-auto'>
            <h1 className="text-3xl font-bold underline">
                iAmFreelancer
            </h1>
            <h2>{react_vite_url}</h2>
        </div>
    )
}

export default Home
