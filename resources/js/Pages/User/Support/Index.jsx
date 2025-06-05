import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import UserDashboardLayout from '@/Layouts/UserDashboardLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, PhoneIcon, ClockIcon, EnvelopeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Support({ auth, success, tickets }) {
    const [formVisible, setFormVisible] = useState(true);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        message: '',
        category: 'booking',
        priority: 'medium',
        attachment: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('support.store'), {
            onSuccess: () => {
                reset();
                window.scrollTo(0, 0);
            },
        });
    };
    
    const priorityColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-red-100 text-red-800',
    };
    
    const categoryLabels = {
        booking: 'Masalah Booking',
        payment: 'Masalah Pembayaran',
        account: 'Masalah Akun',
        other: 'Lainnya',
    };
    
    const handleAttachmentChange = (e) => {
        setData('attachment', e.target.files[0]);
    };

    return (
        <UserDashboardLayout
            auth={auth}
            header={<h2 className="text-xl font-semibold text-gray-800">Pusat Bantuan</h2>}
        >
            <Head title="Pusat Bantuan" />

            <div className="space-y-6">
                {success && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 sm:rounded-xl shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{success}</p>
                                <p className="mt-1 text-sm text-green-700">Tim bantuan kami akan meninjau permintaan Anda dan merespons sesegera mungkin.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Kartu Bantuan Cepat */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow-sm sm:rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                                <PhoneIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Kontak Darurat</h3>
                                <p className="text-gray-500">Untuk keadaan darurat medis</p>
                                <p className="text-xl font-bold text-primary-600 mt-1">
                                    <a href="tel:+62112">112</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white shadow-sm sm:rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                                <EnvelopeIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Email Dukungan</h3>
                                <p className="text-gray-500">Kirim email langsung kepada kami</p>
                                <p className="text-sm font-medium text-primary-600 mt-1">
                                    <a href="mailto:support@ambulance-portal.com">support@ambulance-portal.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white shadow-sm sm:rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                                <ClockIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Jam Operasional</h3>
                                <p className="text-gray-500">Kapan kami tersedia</p>
                                <p className="text-sm text-gray-600 mt-1">Senin-Jumat: 09.00-17.00</p>
                                <p className="text-sm text-gray-600">Sabtu: 09.00-12.00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Permintaan Bantuan */}
                <div className="bg-white shadow-sm sm:rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900">Ajukan Permintaan Bantuan</h3>
                        </div>
                        <button 
                            onClick={() => setFormVisible(!formVisible)}
                            className="px-3 py-1 text-sm font-medium text-primary-700 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors"
                        >
                            {formVisible ? 'Sembunyikan Form' : 'Tampilkan Form'}
                        </button>
                    </div>
                    
                    {formVisible && (
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="subject" value="Subjek" />
                                        <TextInput
                                            id="subject"
                                            type="text"
                                            name="subject"
                                            value={data.subject}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('subject', e.target.value)}
                                            required
                                            placeholder="Deskripsi singkat masalah Anda"
                                        />
                                        <InputError message={errors.subject} className="mt-2" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="category" value="Kategori" />
                                            <select
                                                id="category"
                                                name="category"
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                                                required
                                            >
                                                <option value="booking">Masalah Booking</option>
                                                <option value="payment">Masalah Pembayaran</option>
                                                <option value="account">Masalah Akun</option>
                                                <option value="other">Lainnya</option>
                                            </select>
                                            <InputError message={errors.category} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="priority" value="Prioritas" />
                                            <select
                                                id="priority"
                                                name="priority"
                                                value={data.priority}
                                                onChange={(e) => setData('priority', e.target.value)}
                                                className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                                                required
                                            >
                                                <option value="low">Rendah</option>
                                                <option value="medium">Sedang</option>
                                                <option value="high">Tinggi</option>
                                            </select>
                                            <InputError message={errors.priority} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="message" value="Pesan" />
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm"
                                        rows="6"
                                        required
                                        placeholder="Silakan jelaskan masalah Anda secara detail..."
                                    ></textarea>
                                    <InputError message={errors.message} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="attachment" value="Lampiran (opsional)" />
                                    <input
                                        id="attachment"
                                        type="file"
                                        name="attachment"
                                        onChange={handleAttachmentChange}
                                        className="mt-1 block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary-100 file:text-primary-700 hover:file:bg-primary-200"
                                    />
                                    <InputError message={errors.attachment} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">Ukuran maksimum file: 5MB</p>
                                </div>

                                <div className="flex items-center justify-end">
                                    <PrimaryButton className="ml-4" disabled={processing} type="submit">
                                        Kirim Permintaan
                                        <PaperAirplaneIcon className="h-4 w-4 ml-2" />
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Riwayat Tiket */}
                {tickets && tickets.length > 0 && (
                    <div className="bg-white shadow-sm sm:rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Riwayat Tiket Bantuan</h3>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subjek
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Prioritas
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                #{ticket.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {ticket.subject}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {categoryLabels[ticket.category]}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[ticket.priority]}`}>
                                                    {ticket.priority === 'low' ? 'Rendah' : ticket.priority === 'medium' ? 'Sedang' : 'Tinggi'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    ticket.status === 'open' ? 'bg-green-100 text-green-800' : 
                                                    ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {ticket.status === 'open' ? 'Terbuka' : 
                                                     ticket.status === 'in_progress' ? 'Sedang Diproses' : 
                                                     'Selesai'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(ticket.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <Link
                                                    href={route('support.show', ticket.id)}
                                                    className="text-primary-600 hover:text-primary-900"
                                                >
                                                    Lihat Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {tickets && tickets.length === 0 && (
                    <div className="bg-white shadow-sm sm:rounded-xl p-6 text-center">
                        <ExclamationTriangleIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Riwayat Tiket</h3>
                        <p className="text-gray-500">
                            Anda belum pernah mengirimkan permintaan bantuan sebelumnya.
                        </p>
                    </div>
                )}
            </div>
        </UserDashboardLayout>
    );
}
