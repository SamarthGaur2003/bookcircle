import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/layout/ProtectedRoute'

import HomePage from './pages/HomePage'
import BrowseBooksPage from './pages/BrowseBooksPage'
import BookDetailsPage from './pages/BookDetailsPage'
import SellBookPage from './pages/SellBookPage'
import ChatPage from './pages/ChatPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AboutUsPage from './pages/AboutUsPage'
import FaqPage from './pages/FaqPage'
import MyListingsPage from './pages/MyListingsPage'
import EditListingPage from './pages/EditListingPage'
import NotFoundPage from './pages/NotFoundPage'
import { ToastViewport } from './context/ToastContext'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<ProtectedRoute><BrowseBooksPage /></ProtectedRoute>} />
          <Route path="/books/:id" element={<ProtectedRoute><BookDetailsPage /></ProtectedRoute>} />
          <Route path="/sell" element={<ProtectedRoute><SellBookPage /></ProtectedRoute>} />
          <Route path="/chat/:sellerId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/my-listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
          <Route path="/edit-listing/:id" element={<ProtectedRoute><EditListingPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ToastViewport />
    </div>
  )
}
