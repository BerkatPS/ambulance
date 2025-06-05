import React from 'react';
import { Head, Link } from '@inertiajs/react';
import HeroSection from '@/Components/Home/HeroSection';
import { ServiceTypes } from '@/Components/Home/ServiceTypes';
import { HowItWorks } from '@/Components/Home/HowItWorks';
import { Testimonials } from '@/Components/Home/Testimonials';
import { FAQ } from '@/Components/Home/FAQ';
import Footer from '@/Components/Layout/Footer';
import Navbar from '@/Components/Layout/Navbar';

export default function Home({ auth }) {
  return (
    <>
      <Head title="Ambulance Portal - Emergency & Scheduled Medical Transport" />
      <div className="min-h-screen bg-background">
        {/* Sticky Navigation */}
        <div className="sticky top-0 z-50">
          <Navbar auth={auth} />
        </div>

        <main>
          {/* Hero Section with Emergency Booking Feature */}
          <HeroSection />

          {/* Features Banner */}
          <div className="bg-gradient-to-r from-primary-50 to-white py-6 border-y border-primary-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">24/7 Availability</h3>
                    <p className="text-sm text-foreground/70">Round-the-clock emergency response</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">GPS Tracking</h3>
                    <p className="text-sm text-foreground/70">Real-time ambulance location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Certified Medics</h3>
                    <p className="text-sm text-foreground/70">Professional medical staff</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section with ServiceTypes Component */}
          <div className="py-16">
            <ServiceTypes />
          </div>

          {/* Emergency Stats Section */}
          <div className="bg-primary-700 py-16 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid-pattern)" />
              </svg>
              <defs>
                <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white">Making a Difference Every Day</h2>
                <p className="mt-4 text-xl text-white/80">Our team is committed to providing life-saving emergency services</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white mb-2">98%</p>
                  <p className="text-white/80">Response Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white mb-2">12K+</p>
                  <p className="text-white/80">Emergencies Handled</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white mb-2">8 min</p>
                  <p className="text-white/80">Avg. Response Time</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white mb-2">150+</p>
                  <p className="text-white/80">Medical Professionals</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="py-16">
            <HowItWorks />
          </div>

          {/* Call-to-Action Banner */}
          <div className="bg-gradient-to-r from-secondary-600 to-secondary-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="md:flex md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    <span className="block">Need immediate medical assistance?</span>
                  </h2>
                  <p className="mt-3 text-lg text-white/80">
                    Our team of medical professionals is ready to respond 24/7.
                  </p>
                </div>
                <div className="mt-8 flex md:mt-0">
                  <div className="inline-flex rounded-md shadow">
                    <Link
                      href="/emergency-booking"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-secondary-600 hover:bg-gray-50"
                    >
                      Book Emergency Now
                    </Link>
                  </div>
                  <div className="ml-3 inline-flex">
                    <a
                      href="tel:119"
                      className="inline-flex items-center justify-center rounded-md border border-white px-5 py-3 text-base font-medium text-white hover:bg-secondary-700"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Call Emergency
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="py-16 bg-gray-50">
            <Testimonials />
          </div>

          {/* FAQ Section */}
          <div className="py-16">
            <FAQ />
          </div>

          {/* Download App Section */}
          <div className="bg-gradient-to-b from-primary-50 to-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                    Get Our Mobile App
                  </h2>
                  <p className="mt-4 text-lg text-foreground/70">
                    Download our mobile app for faster emergency booking, real-time ambulance tracking, and instant access to medical help.
                  </p>
                  <div className="mt-8 flex space-x-4">
                    <a href="#" className="inline-block">
                      <img className="h-14" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1000px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" />
                    </a>
                    <a href="#" className="inline-block">
                      <img className="h-14" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1000px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" />
                    </a>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-1">
                        <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                        <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                      </div>
                      <span className="text-sm text-foreground/70">
                        Joined by <span className="font-medium text-primary">50,000+</span> users
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-10 lg:mt-0 relative">
                  <div className="relative mx-auto w-full max-w-md">
                    <img className="w-full rounded-lg shadow-xl ring-1 ring-gray-400/10" src="https://img.freepik.com/free-vector/telemedicine-abstract-concept-vector-illustration-telemedicine-application-online-medical-consultation-healthcare-digital-technologies-diagnosis-treatment-abstract-metaphor_335657-1797.jpg" alt="Mobile app" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
