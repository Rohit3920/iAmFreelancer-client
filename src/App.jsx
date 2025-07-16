import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectRoute from './ProtectRoute'
import PageNotFound from './PageNotFound'
import Home from './pages/Home'
import Navbar from './component/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgetPassword from './component/ForgetPassword'
import Profile from './pages/Profile'
import Details from './component/Details'
import UploadProfile from './component/detailsForm/UploadProfile'
import CreateGig from './pages/gig/CreateGig'
import UpdateGig from './pages/gig/UpdateGig'
import GigList from './pages/gig/GigList'
import GigDetails from './pages/gig/GigDetails'

function App() {

  return (
    <div className='text-center mx-auto'>
      <Router>
        <Navbar />
        <div className="pb-28"></div>
        <Routes>
          <Route element={<ProtectRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/details" element={<Details />} />
            <Route path="/upload-profile" element={<UploadProfile />} />

            {/* gig routes */}
            <Route path="/create-gig" element={<CreateGig />} />
            <Route path="/update-gig/:gigId" element={<UpdateGig />} />
            <Route path="/view-gigs" element={<GigList />} />
            <Route path="/view-gig/:gigId" element={<GigDetails />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
