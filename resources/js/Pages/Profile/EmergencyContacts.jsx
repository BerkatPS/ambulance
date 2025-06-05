import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import UserDashboardLayout from "@/Layouts/UserDashboardLayout.jsx";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function EmergencyContacts({ auth, emergencyContacts = [], success }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [contacts, setContacts] = useState(emergencyContacts);

    const { data, setData, post, processing, errors, reset } = useForm({
        relationship: '',
        phone: '',
        address: '',
    });

    const submitForm = (e) => {
        e.preventDefault();
        post(route('profile.emergency-contacts.store'), {
            onSuccess: (response) => {
                reset();
                setShowAddForm(false);
                // Refresh the page to show the new contact
                window.location.reload();
                toast.success('Emergency contact added successfully');
            },
            onError: () => {
                toast.error('Failed to add emergency contact');
            }
        });
    };

    const deleteContact = (id) => {
        if (confirm('Are you sure you want to remove this emergency contact?')) {
            setIsDeleting(true);
            
            axios.delete(route('profile.emergency-contacts.destroy', id))
                .then(response => {
                    // Remove the deleted contact from state
                    setContacts(contacts.filter(contact => contact.id !== id));
                    toast.success('Emergency contact removed successfully');
                })
                .catch(error => {
                    console.toast.error('Error deleting contact:', error);
                    toast.error('Failed to delete emergency contact');
                })
                .finally(() => {
                    setIsDeleting(false);
                });
        }
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Emergency Contacts</h2>}
        >
            <Head title="Emergency Contacts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <div className="max-w-xl">
                            <section>
                                <header>
                                    <h2 className="text-lg font-medium text-gray-900">Emergency Contacts</h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Add emergency contacts that we can reach out to in case of emergencies.
                                    </p>
                                </header>

                                {success && (
                                    <div className="mt-4 p-4 bg-green-50 rounded-md">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-green-800">{success}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 space-y-4">
                                    {contacts.length > 0 ? (
                                        contacts.map((contact) => (
                                            <div key={contact.id} className="border rounded-md p-4 relative">
                                                <button
                                                    onClick={() => deleteContact(contact.id)}
                                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                                                    disabled={isDeleting}
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                                        <p className="text-gray-900">{contact.name}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">Relationship</h3>
                                                        <p className="text-gray-900">{contact.relationship}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                                        <p className="text-gray-900">{contact.phone}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                                                        <p className="text-gray-900">{contact.address || 'Not provided'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 border rounded-md border-dashed">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="mt-2 text-sm text-gray-500">No emergency contacts added yet</p>
                                        </div>
                                    )}
                                </div>

                                {!showAddForm ? (
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(true)}
                                            className="flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-1" />
                                            Add Emergency Contact
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={submitForm} className="mt-6 space-y-6 border rounded-md p-4 bg-gray-50">
                                        <h3 className="text-md font-medium text-gray-900">Add New Emergency Contact</h3>

                                        <div>
                                            <InputLabel htmlFor="name" value="Name" />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="relationship" value="Relationship" />
                                            <TextInput
                                                id="relationship"
                                                type="text"
                                                name="relationship"
                                                value={data.relationship}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('relationship', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.relationship} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="phone" value="Phone Number" />
                                            <TextInput
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                value={data.phone}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('phone', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.phone} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="address" value="Address (Optional)" />
                                            <TextInput
                                                id="address"
                                                type="text"
                                                name="address"
                                                value={data.address}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('address', e.target.value)}
                                            />
                                            <InputError message={errors.address} className="mt-2" />
                                        </div>

                                        <div className="flex items-center justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowAddForm(false);
                                                    reset();
                                                }}
                                                className="text-sm text-gray-600 hover:text-gray-900"
                                            >
                                                Cancel
                                            </button>

                                            <PrimaryButton disabled={processing}>
                                                Save Contact
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
