import { Head, Link } from '@inertiajs/react';
import HeroSection from '@/Components/Home/HeroSection';
import {ServiceTypes} from '@/Components/Home/ServiceTypes';
import { HowItWorks } from '@/Components/Home/HowItWorks';
import { FAQ } from '@/Components/Home/FAQ';
import { Testimonials } from '@/Components/Home/Testimonials';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-primary selection:text-white">

                {/* Navigation */}
                <div className="bg-white sticky top-0 z-50 shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex flex-shrink-0 items-center">
                                    <Link href="/">
                                        <h1 className="text-xl font-bold text-primary">Ambulance<span className="text-secondary">Portal</span></h1>
                                    </Link>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center border-b-2 border-primary px-1 pt-1 text-sm font-medium text-foreground"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/services"
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-foreground/70 hover:border-secondary hover:text-foreground"
                                    >
                                        Services
                                    </Link>
                                    <Link
                                        href="/about"
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-foreground/70 hover:border-secondary hover:text-foreground"
                                    >
                                        About
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-foreground/70 hover:border-secondary hover:text-foreground"
                                    >
                                        Contact
                                    </Link>
                                </div>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:items-center">
                                {auth.user ? (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded-md bg-primary-50 px-3.5 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-primary-100"
                                        >
                                            Dashboard
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link
                                            href={route('login')}
                                            className="text-sm font-semibold leading-6 text-foreground"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <HeroSection />

                {/* Service Types */}
                <ServiceTypes />

                {/* How It Works */}
                <HowItWorks />

                {/* Testimonials */}
                <Testimonials />

                {/* FAQ Section */}
                <FAQ />

                {/* CTA Section */}
                <div className="bg-primary">
                    <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            <span className="block">Need an ambulance?</span>
                            <span className="block text-white/90">Book one now or call our emergency line.</span>
                        </h2>
                        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                            <div className="inline-flex rounded-md shadow">
                                <Link
                                    href={route('emergency-booking.store')}
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
                                >
                                    Book Now
                                </Link>
                            </div>
                            <div className="ml-3 inline-flex rounded-md shadow">
                                <a
                                    href="tel:119"
                                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800"
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

                {/* Footer */}
                <footer className="bg-white">
                    <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                        <div className="flex justify-center space-x-6 md:order-2">
                            <a href="#" className="text-foreground/50 hover:text-primary">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-foreground/50 hover:text-primary">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-foreground/50 hover:text-primary">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                        </div>
                        <div className="mt-8 md:mt-0 md:order-1">
                            <p className="text-center text-base text-foreground/50">
                                &copy; {new Date().getFullYear()} Ambulance Booking Service. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
