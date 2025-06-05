import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/Common/ApplicationLogo';

export default function Navbar({ auth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white'} transition-all duration-300 sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <ApplicationLogo className="block h-10 w-auto fill-current text-primary hover:text-primary-600 transition duration-200" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-primary text-sm font-medium leading-5 text-foreground focus:outline-none focus:border-primary transition duration-150 ease-in-out"
              >
                Home
              </Link>
              <Link 
                href="/services"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-muted hover:text-foreground hover:border-secondary focus:outline-none focus:text-foreground focus:border-secondary transition duration-150 ease-in-out"
              >
                Services
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-muted hover:text-foreground hover:border-secondary focus:outline-none focus:text-foreground focus:border-secondary transition duration-150 ease-in-out"
              >
                About Us
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-muted hover:text-foreground hover:border-secondary focus:outline-none focus:text-foreground focus:border-secondary transition duration-150 ease-in-out"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {auth?.user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-secondary hover:text-secondary-700 focus:outline-none transition duration-150 ease-in-out"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-secondary hover:text-secondary-700 focus:outline-none transition duration-150 ease-in-out"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary shadow-sm hover:shadow hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  Register
                </Link>
              </>
            )}
            <a 
              href="tel:119" 
              className="inline-flex items-center px-3 py-2 border border-primary text-sm font-medium rounded-md text-primary hover:bg-primary-50 focus:outline-none transition duration-150 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Emergency
            </a>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted hover:text-foreground hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-foreground transition duration-150 ease-in-out"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/" 
              className="block pl-3 pr-4 py-2 border-l-4 border-primary text-base font-medium text-primary bg-primary-50 focus:outline-none focus:text-primary focus:bg-primary-100 focus:border-primary transition duration-150 ease-in-out"
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-muted hover:text-foreground hover:bg-gray-50 hover:border-secondary focus:outline-none focus:text-foreground focus:bg-gray-50 focus:border-secondary transition duration-150 ease-in-out"
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-muted hover:text-foreground hover:bg-gray-50 hover:border-secondary focus:outline-none focus:text-foreground focus:bg-gray-50 focus:border-secondary transition duration-150 ease-in-out"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-muted hover:text-foreground hover:bg-gray-50 hover:border-secondary focus:outline-none focus:text-foreground focus:bg-gray-50 focus:border-secondary transition duration-150 ease-in-out"
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {auth?.user ? (
              <div className="space-y-1">
                <Link 
                  href="/dashboard" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-muted hover:text-foreground hover:bg-gray-50 hover:border-secondary focus:outline-none focus:text-foreground focus:bg-gray-50 focus:border-secondary transition duration-150 ease-in-out"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-muted hover:text-foreground hover:bg-gray-50 hover:border-secondary focus:outline-none focus:text-foreground focus:bg-gray-50 focus:border-secondary transition duration-150 ease-in-out"
                >
                  Profile
                </Link>
                <Link 
                  href="/logout" 
                  method="post" 
                  as="button" 
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-muted hover:text-foreground hover:bg-gray-50 hover:border-secondary focus:outline-none focus:text-foreground focus:bg-gray-50 focus:border-secondary transition duration-150 ease-in-out"
                >
                  Logout
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <Link 
                  href="/login" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-muted hover:text-foreground hover:bg-gray-50 hover:border-secondary focus:outline-none focus:text-foreground focus:bg-gray-50 focus:border-secondary transition duration-150 ease-in-out"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-muted hover:text-foreground hover:bg-gray-50 hover:border-secondary focus:outline-none focus:text-foreground focus:bg-gray-50 focus:border-secondary transition duration-150 ease-in-out"
                >
                  Register
                </Link>
              </div>
            )}
            <div className="mt-3 px-3">
              <a 
                href="tel:119" 
                className="flex items-center justify-center w-full px-4 py-2 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-primary-50 focus:outline-none transition duration-150 ease-in-out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Emergency Call
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
