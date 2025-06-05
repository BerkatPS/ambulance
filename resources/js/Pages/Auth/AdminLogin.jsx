import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function AdminLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
            <Head title="Admin Login" />
            
            <div className="w-full sm:max-w-md px-8 py-10 bg-white shadow-xl rounded-xl overflow-hidden relative z-10">
                <div className="absolute top-0 left-0 right-0 h-2 bg-primary-600"></div>
                
                <div className="flex flex-col items-center mb-8">
                    <Link href="/">
                        <ApplicationLogo className="w-24 h-24 fill-current text-primary-600" />
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ambulance Management System
                    </p>
                </div>
                
                {status && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                        <div className="flex">
                            <svg className="h-5 w-5 text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {status}
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                autoComplete="username"
                                isFocused={true}
                                placeholder="admin@example.com"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <TextInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 pr-10"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button 
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        {canResetPassword && (
                            <div className="text-sm">
                                <Link href={route('admin.password.request')} className="font-medium text-primary-600 hover:text-primary-500">
                                    Forgot password?
                                </Link>
                            </div>
                        )}
                    </div>

                    <div>
                        <PrimaryButton 
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            disabled={processing}
                        >
                            {processing ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            Sign in to Admin Portal
                        </PrimaryButton>
                    </div>
                </form>

                <div className="mt-8 border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-500">
                            {new Date().getFullYear()} Ambulance Portal. All rights reserved.
                        </span>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-primary-600 opacity-5 z-0"></div>
            <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 z-0"></div>
            <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 z-0"></div>
        </div>
    );
}
