import { Head, useForm, Link } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';
import PrimaryButton from '@/Components/PrimaryButton';
import { ChevronLeftIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function SupportCreate({ auth, booking, notifications = [], unreadCount = 0 }) {
    const { data, setData, post, processing, errors } = useForm({
        subject: booking ? `Issue with Booking #${booking.booking_number}` : '',
        category: booking ? 'booking' : '',
        message: '',
        priority: 'medium',
        booking_id: booking ? booking.id : null,
    });

    const categories = [
        { value: '', label: 'Pilih Kategori' },
        { value: 'booking', label: 'Reservasi Ambulans' },
        { value: 'payment', label: 'Pembayaran' },
        { value: 'account', label: 'Akun Pengguna' },
        { value: 'other', label: 'Lainnya' },
    ];

    const priorities = [
        { value: 'low', label: 'Rendah' },
        { value: 'medium', label: 'Sedang' },
        { value: 'high', label: 'Tinggi' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('support.store'));
    };

    return (
        <UserDashboardLayout
            user={auth.user}
            notifications={notifications}
            unreadCount={unreadCount}
            header={<h2 className="text-xl font-semibold text-gray-800">Hubungi Dukungan</h2>}
        >
            <Head title="Hubungi Dukungan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Back navigation */}
                    <div className="flex items-center mb-4">
                        <Link
                            href={route('support')}
                            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            <ChevronLeftIcon className="w-5 h-5 mr-1" />
                            Kembali ke Dukungan
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Buat Tiket Dukungan</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Silakan isi formulir di bawah ini untuk menghubungi tim dukungan kami. Kami akan membalas dalam 24 jam kerja.
                                </p>
                            </div>

                            {booking && (
                                <div className="mb-6 p-4 border border-primary-200 rounded-lg bg-primary-50">
                                    <div className="flex items-start">
                                        <ExclamationCircleIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-3" />
                                        <div>
                                            <h4 className="text-sm font-medium text-primary-800">Tiket terkait reservasi ambulans</h4>
                                            <p className="mt-1 text-sm text-primary-700">
                                                Anda membuat tiket dukungan terkait dengan reservasi #{booking.booking_number}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <InputLabel htmlFor="subject" value="Subjek" />
                                        <TextInput
                                            id="subject"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.subject} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="category" value="Kategori" />
                                        <SelectInput
                                            id="category"
                                            className="mt-1 block w-full"
                                            options={categories}
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.category} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <InputLabel htmlFor="message" value="Pesan" />
                                    <TextArea
                                        id="message"
                                        className="mt-1 block w-full"
                                        rows={6}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.message} className="mt-2" />
                                </div>

                                <div className="mb-6">
                                    <InputLabel htmlFor="priority" value="Prioritas" />
                                    <div className="mt-1 flex space-x-4">
                                        {priorities.map((priority) => (
                                            <label key={priority.value} className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="priority"
                                                    value={priority.value}
                                                    checked={data.priority === priority.value}
                                                    onChange={() => setData('priority', priority.value)}
                                                    className="text-primary-600 focus:ring-primary-500 h-4 w-4 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">{priority.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.priority} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <PrimaryButton disabled={processing} className="ml-4">
                                        Kirim Tiket
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
