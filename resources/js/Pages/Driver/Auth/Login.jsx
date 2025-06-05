import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { TruckIcon } from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
    const [loginMethod, setLoginMethod] = useState('employee_id');
    
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('driver.login'));
    };
    
    const toggleLoginMethod = () => {
        setLoginMethod(loginMethod === 'employee_id' ? 'email' : 'employee_id');
        setData('login', ''); // Clear the login field when switching
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-medical-gray-50">
            <Head title="Driver Login" />
            
            <div className="w-full sm:max-w-md mx-4 sm:mx-auto">
                <div className="text-center mb-6">
                    <div className="inline-flex p-3 bg-secondary-100 rounded-full mb-4">
                        <TruckIcon className="w-14 h-14 text-secondary-600" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-foreground">Driver Login</h1>
                    <p className="text-medical-gray-600 mt-2">Sign in to access your driver dashboard</p>
                </div>

                <div className="bg-white shadow-lg rounded-lg px-8 py-10 border border-medical-gray-200">
                    {status && (
                        <div className="mb-6 p-4 rounded-md bg-success/10 border border-success/30 text-sm text-success font-medium">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="login" value={loginMethod === 'employee_id' ? 'Employee ID' : 'Email'} className="text-medical-gray-700 font-semibold" />

                            <TextInput
                                id="login"
                                type={loginMethod === 'employee_id' ? 'text' : 'email'}
                                name="login"
                                value={data.login}
                                className="mt-2 block w-full border-medical-gray-300 focus:border-secondary-500 focus:ring focus:ring-secondary-200 rounded-md shadow-sm"
                                autoComplete={loginMethod === 'employee_id' ? 'username' : 'email'}
                                isFocused={true}
                                onChange={(e) => setData('login', e.target.value)}
                                placeholder={loginMethod === 'employee_id' ? 'Enter your employee ID' : 'Enter your email address'}
                            />

                            <InputError message={errors.login || errors.email || errors.employee_id} className="mt-2" />
                            
                            <button
                                type="button"
                                onClick={toggleLoginMethod}
                                className="mt-2 text-sm text-secondary-600 hover:text-secondary-800 font-medium focus:outline-none transition duration-150 ease-in-out"
                            >
                                {loginMethod === 'employee_id' 
                                    ? 'Use email to login instead' 
                                    : 'Use employee ID to login instead'}
                            </button>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <InputLabel htmlFor="password" value="Password" className="text-medical-gray-700 font-semibold" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-secondary-600 hover:text-secondary-800 font-medium transition duration-150 ease-in-out"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-2 block w-full border-medical-gray-300 focus:border-secondary-500 focus:ring focus:ring-secondary-200 rounded-md shadow-sm"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter your password"
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    className="rounded border-medical-gray-300 text-secondary-600 shadow-sm focus:ring-secondary-500"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-medical-gray-600">Remember me</span>
                            </label>
                        </div>

                        <div>
                            <PrimaryButton 
                                className="w-full justify-center bg-secondary-600 hover:bg-secondary-700 focus:bg-secondary-700"
                                disabled={processing}
                            >
                                {processing ? 'Signing in...' : 'Sign in'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
                
                <div className="text-center mt-6 text-sm text-medical-gray-600">
                    Need assistance? Contact <span className="text-secondary-600 font-medium">support@ambulance-portal.com</span>
                </div>
            </div>
        </div>
    );
}
