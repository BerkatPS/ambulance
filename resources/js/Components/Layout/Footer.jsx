import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/Common/ApplicationLogo';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          <div className="md:col-span-1">
            <Link href="/" className="block">
              <ApplicationLogo className="h-12 w-auto text-white hover:text-primary-200 transition duration-200" />
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Providing reliable emergency and non-emergency medical transportation services since 2023.
            </p>
            <div className="mt-6">
              <a 
                href="tel:119" 
                className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-md text-white bg-primary-800 hover:bg-primary-700 focus:outline-none transition duration-150 ease-in-out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Emergency: 119
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-primary-300 uppercase tracking-wider">Services</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/services/emergency" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  Emergency Transport
                </Link>
              </li>
              <li>
                <Link href="/services/non-emergency" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  Non-Emergency Transport
                </Link>
              </li>
              <li>
                <Link href="/services/specialized" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  Specialized Care Transport
                </Link>
              </li>
              <li>
                <Link href="/services/neonatal" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  Neonatal Transport
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-primary-300 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  Our Partners
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-primary-300 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/faq" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-base text-gray-300 hover:text-white hover:underline transition">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-primary-300 uppercase tracking-wider">Get Our Mobile App</h3>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="inline-block">
                  <img className="h-10" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1000px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" />
                </a>
                <a href="#" className="inline-block">
                  <img className="h-10" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1000px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary-300 uppercase tracking-wider">Newsletter</h3>
              <p className="mt-2 text-sm text-gray-400">Subscribe to our newsletter for updates and health tips.</p>
              <form className="mt-4 flex flex-col sm:flex-row gap-2">
                <div className="flex-grow">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input id="email-address" name="email" type="email" autoComplete="email" required className="w-full min-w-0 bg-white bg-opacity-10 border border-gray-700 rounded-md py-2 px-4 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent" placeholder="Enter your email" />
                </div>
                <div className="flex-shrink-0">
                  <button type="submit" className="w-full bg-primary hover:bg-primary-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Ambulance Portal. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary-300 transition">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-300 transition">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-300 transition">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-300 transition">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
