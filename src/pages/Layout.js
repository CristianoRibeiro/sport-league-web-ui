import React from 'react';
import Navbar from './components/Navbar'
import Footer from './components/Footer';


function Layout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
