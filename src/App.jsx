import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PageNotFound from './PageNotFound'
import Home from './pages/Home'

function App() {

  return (
    <div className='text-center mx-auto'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
