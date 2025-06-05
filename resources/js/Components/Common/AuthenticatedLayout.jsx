import React, { useState } from 'react';
import ApplicationLogo from './ApplicationLogo';
import Dropdown from './Dropdown';
import NavLink from './NavLink';
import ResponsiveNavLink from './ResponsiveNavLink';
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, header, children, navigation = [] }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-medical-gray-50">
            <nav className="bg-white border-b border-medical-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route('dashboard')}>
                                    <ApplicationLogo className="block h-9 w-auto" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                {navigation.map((item) => (
                                    <NavLink 
                                        key={item.name}
                                        href={item.href}
                                        active={item.active}
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-medical-gray-800 bg-white hover:text-medical-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition ease-in-out duration-150"
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium mr-2">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {user.name}

                                                    <svg
                                                        className="ml-2 -mr-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="48" contentClasses="py-1 bg-white">
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-medical-gray-400 hover:text-medical-gray-500 hover:bg-medical-gray-100 focus:outline-none focus:bg-medical-gray-100 focus:text-medical-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <ResponsiveNavLink
                                key={item.name}
                                href={item.href}
                                active={item.active}
                            >
                                {item.name}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="pt-4 pb-1 border-t border-medical-gray-200">
                        <div className="px-4 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            
                            <div className="ml-3">
                                <div className="font-medium text-base text-medical-gray-800">{user.name}</div>
                                <div className="font-medium text-sm text-medical-gray-500">{user.email}</div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-medical-gray-200">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
            
            <footer className="bg-white border-t border-medical-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-medical-gray-500">
                            &copy; {new Date().getFullYear()} Ambulance Portal. All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-medical-gray-500 hover:text-primary-500">
                                <span className="sr-only">Privacy Policy</span>
                                <span>Privacy Policy</span>
                            </a>
                            <a href="#" className="text-medical-gray-500 hover:text-primary-500">
                                <span className="sr-only">Terms of Service</span>
                                <span>Terms of Service</span>
                            </a>
                            <a href="#" className="text-medical-gray-500 hover:text-primary-500">
                                <span className="sr-only">Contact</span>
                                <span>Contact</span>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
