import Swal from 'sweetalert2';

// Custom SweetAlert styling to match the Tailwind design system
const SweetAlert = Swal.mixin({
    customClass: {
        popup: 'rounded-lg shadow-card bg-white border border-gray-100',
        title: 'text-lg font-semibold text-gray-900 font-heading',
        htmlContainer: 'text-base text-gray-700 font-body',
        confirmButton: 'bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md px-5 py-2.5 text-sm transition duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        cancelButton: 'bg-white border border-gray-300 text-gray-700 font-medium rounded-md px-5 py-2.5 text-sm transition duration-150 ease-in-out shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ml-3',
        actions: 'mt-5 space-x-3',
        icon: 'text-3xl mb-2', // Reduced icon size from 5xl to 4xl
    },
    buttonsStyling: false,
    reverseButtons: true,
    showClass: {
        popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOut animate__faster'
    },
    // Set width for all alerts to be smaller and more compact
    width: 'auto',
    padding: '1.5rem',
});

// Success Toast
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: 'rounded-md shadow-lg bg-white p-3 border border-gray-100',
        title: 'text-sm font-medium text-gray-900 font-body ml-2',
        icon: 'text-lg', // Reduced icon size from xl to lg
    },
    iconColor: '#FF624E', // Using primary color from design system
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

// Success Alert
const successAlert = (title, text) => {
    return SweetAlert.fire({
        icon: 'success',
        title: title || 'Berhasil!',
        text: text,
        iconColor: '#56C288', // success color from design system
    });
};

// Error Alert
const errorAlert = (title, text) => {
    return SweetAlert.fire({
        icon: 'error',
        title: title || 'Gagal!',
        text: text,
        iconColor: '#F15B50', // danger color from design system
    });
};

// Warning Alert
const warningAlert = (title, text) => {
    return SweetAlert.fire({
        icon: 'warning',
        title: title || 'Perhatian!',
        text: text,
        iconColor: '#FFB76B', // warning color from design system
    });
};

// Info Alert
const infoAlert = (title, text) => {
    return SweetAlert.fire({
        icon: 'info',
        title: title || 'Informasi',
        text: text,
        iconColor: '#4B9CE3', // secondary/info color from design system
    });
};

// Confirmation Alert
const confirmAlert = (title, text, confirmButtonText, cancelButtonText) => {
    return SweetAlert.fire({
        icon: 'question',
        title: title || 'Anda yakin?',
        text: text,
        iconColor: '#4B9CE3', // Using secondary color for question
        showCancelButton: true,
        confirmButtonText: confirmButtonText || 'Ya, lanjutkan',
        cancelButtonText: cancelButtonText || 'Batal',
        // More compact sizing for confirmation dialog
        width: 'auto',
        padding: '1.25rem',
    });
};

// Success Toast
const successToast = (title) => {
    return Toast.fire({
        icon: 'success',
        title: title,
        iconColor: '#56C288', // success color from design system
    });
};

// Error Toast
const errorToast = (title) => {
    return Toast.fire({
        icon: 'error',
        title: title,
        iconColor: '#F15B50', // danger color from design system
    });
};

// Warning Toast
const warningToast = (title) => {
    return Toast.fire({
        icon: 'warning',
        title: title,
        iconColor: '#FFB76B', // warning color from design system
    });
};

// Info Toast
const infoToast = (title) => {
    return Toast.fire({
        icon: 'info',
        title: title,
        iconColor: '#4B9CE3', // secondary/info color from design system
    });
};

export {
    SweetAlert,
    Toast,
    successAlert,
    errorAlert,
    warningAlert,
    infoAlert,
    confirmAlert,
    successToast,
    errorToast,
    warningToast,
    infoToast
};
