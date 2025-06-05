import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout
            title="Verify Your Email"
            subtitle="One more step to secure your account"
        >
            <Head title="Email Verification" />

            <div className="mb-6 text-sm text-gray-600 bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p>
                            Thanks for signing up! Before getting started, please verify your email address by clicking on the link we just emailed to you. If you didn't receive the email, we can resend it using the button below.
                        </p>
                    </div>
                </div>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p>A new verification link has been sent to the email address you provided during registration.</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-full">
                        <PrimaryButton
                            className="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            disabled={processing}
                        >
                            {processing ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            Resend Verification Email
                        </PrimaryButton>
                    </div>
                    <div className="w-full">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                            Log Out
                        </Link>
                    </div>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Having trouble?{' '}
                    <Link
                        href={route('contact')}
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        Contact Support
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
