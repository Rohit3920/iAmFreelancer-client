import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import ChatUI from './component/message/ChatUl'
import UserProfile from './pages/UserProfile'
import Order from './pages/Order'
import ViewOrder from './pages/order/ViewOrder'
import Dashboard from './pages/dashboard/Dashboard'
import CreateOrder from './pages/order/CreateOrder'
import Breadcrumb from './component/breadcrumbs/Breadcrumb'
import Footer from './component/Footer'
import MyLikedGig from './pages/gig/MyLikedGig'
import MyEarning from './pages/MyEarning'

function App() {

  return (
    <div className='text-center mx-auto'>
      <Router>
        <Navbar />
        <div className="pb-28"></div>
        <Breadcrumb />
        <Routes>
          <Route element={<ProtectRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/my-dashboard" element={<Dashboard />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/details" element={<Details />} />
            <Route path="/upload-profile" element={<UploadProfile />} />
            <Route path='/view-user-profile/:userId' element={<UserProfile />} />

            {/* gig routes */}
            <Route path="/create-gig" element={<CreateGig />} />
            <Route path="/update-gig/:gigId" element={<UpdateGig />} />
            {/* <Route path="/view-gigs" element={<GigList />} /> */}
            <Route path="/view-gigs/:userId" element={<GigList />} />
            <Route path="/liked-gigs" element={<MyLikedGig />} />
            <Route path="/My-Earning" element={<MyEarning />} />
            {/* <Route path="/:messageUserId/view-gigs/:gigId" element={<GigList />} /> */}
            <Route path="/view-gig/:gigId" element={<GigDetails />} />

            {/* chat routes */}
            <Route path="/user/messages" element={<ChatUI />} />
            <Route path="/user/messages/:messageUserId" element={<ChatUI />} />

            {/* order routes */}
            <Route path='/my-order' element={<Order />} />
            <Route path='/view-order/:id' element={<ViewOrder />} />
            <Route path='/add-order/:gigId' element={<CreateOrder />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
