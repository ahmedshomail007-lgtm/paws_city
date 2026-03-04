import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTop from '../ScrollToTop'
import FloatingChatbot from '../components/FloatingChatbot'

const Layout = () => {
  return (
    <>
      <ScrollToTop />  
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingChatbot />
    </>
  )
}

export default Layout
