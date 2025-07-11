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

function App() {

  return (
    <div className='text-center mx-auto'>
      <Router>
        <Navbar />
        <div className="pb-20"></div>
        <Routes>
          <Route element={<ProtectRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/details" element={<Details />} />
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
