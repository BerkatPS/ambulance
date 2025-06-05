 import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    BellAlertIcon,
    MapPinIcon,
    TruckIcon,
    CreditCardIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const NotificationToast = ({
    type = 'success',
    title,
    message,
    show = true,
    onClose,
    autoClose = true,
    duration = 5000,
    playSound = true,
    actionText,
    actionUrl,
    referenceId,
    notification = null,
    closeToast = null
}) => {
    const [isVisible, setIsVisible] = useState(show);

    // Handle notification appearance and disappearance
    useEffect(() => {
        setIsVisible(show);

        // Play notification sound if enabled
        if (show && playSound) {
            try {
                // Select sound based on notification type
                let soundFile = '/sounds/notification.mp3';

                if (type === 'emergency' || type === 'emergency_booking') {
                    soundFile = '/sounds/ambulance-siren-us.mp3';
                } else if (type === 'booking' || type === 'new_booking') {
                    soundFile = '/sounds/notification-booking.mp3';
                }

                // Create audio element with direct source assignment
                const audio = new Audio(soundFile);

                // Set properties based on type
                audio.volume = type.includes('emergency') ? 1.0 : 0.5;
                audio.preload = 'auto';

                // Play the sound with error handling
                audio.play().catch(error => {
                    console.error('Failed to play notification sound:', error);
                });
            } catch (error) {
                console.error('Error initializing notification sound:', error);
            }
        }

        // Auto close logic for when not used with toast library
        let timer;
        if (autoClose && show && !closeToast) {
            timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) setTimeout(onClose, 300);
            }, duration);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [show, autoClose, duration, onClose, playSound, type, closeToast]);

    const handleClose = () => {
        // Support both standalone usage and react-toastify integration
        if (closeToast) {
            closeToast();
        } else {
            setIsVisible(false);
            if (onClose) setTimeout(onClose, 300);
        }
    };

    // Handle icon and color based on notification type
    const getIconAndColor = () => {
        switch (type) {
            case 'success':
                return {
                    icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-500'
                };
            case 'error':
                return {
                    icon: <ExclamationCircleIcon className="h-6 w-6 text-red-500" />,
                    bgColor: 'bg-red-50',
                    textColor: 'text-red-800',
                    borderColor: 'border-red-500'
                };
            case 'warning':
                return {
                    icon: <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />,
                    bgColor: 'bg-amber-50',
                    textColor: 'text-amber-800',
                    borderColor: 'border-amber-500'
                };
            case 'emergency':
            case 'emergency_booking':
                return {
                    icon: <BellAlertIcon className="h-6 w-6 text-red-500" />,
                    bgColor: 'bg-red-50',
                    textColor: 'text-red-800',
                    borderColor: 'border-red-500'
                };
            case 'booking':
            case 'new_booking':
                return {
                    icon: <TruckIcon className="h-6 w-6 text-blue-500" />,
                    bgColor: 'bg-blue-50',
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-500'
                };
            case 'location':
            case 'location_change':
                return {
                    icon: <MapPinIcon className="h-6 w-6 text-indigo-500" />,
                    bgColor: 'bg-indigo-50',
                    textColor: 'text-indigo-800',
                    borderColor: 'border-indigo-500'
                };
            case 'payment':
            case 'payment_reminder':
                return {
                    icon: <CreditCardIcon className="h-6 w-6 text-amber-500" />,
                    bgColor: 'bg-amber-50',
                    textColor: 'text-amber-800',
                    borderColor: 'border-amber-500'
                };
            case 'schedule':
            case 'schedule_change':
                return {
                    icon: <ClockIcon className="h-6 w-6 text-emerald-500" />,
                    bgColor: 'bg-emerald-50',
                    textColor: 'text-emerald-800',
                    borderColor: 'border-emerald-500'
                };
            default:
                return {
                    icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
                    bgColor: 'bg-blue-50',
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-500'
                };
        }
    };

    const { icon, bgColor, textColor, borderColor } = getIconAndColor();

    // Format received time
    const formatTime = (time) => {
        if (!time) return '';
        const date = new Date(time);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    const notificationTime = notification ? formatTime(notification.created_at) : '';

    const content = (
        <div className={`${bgColor} border-l-4 ${borderColor} p-4 rounded-md shadow-md max-w-md w-full`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    {icon}
                </div>
                <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${textColor}`}>{title}</p>
                        <button
                            onClick={handleClose}
                            className="ml-4 inline-flex text-gray-400 focus:outline-none focus:text-gray-500 rounded-md"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="mt-1">
                        <p className="text-sm text-gray-600">{message}</p>

                        {notificationTime && (
                            <p className="text-xs text-gray-500 mt-1">{notificationTime}</p>
                        )}

                        {(actionText && actionUrl) && (
                            <div className="mt-2">
                                <Link
                                    href={actionUrl}
                                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {actionText}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // When used with react-toastify, it passes closeToast prop
    if (closeToast !== null) {
        return content;
    }

    // Otherwise, use with Transition for standalone usage
    return (
        <Transition
            show={isVisible}
            enter="transition ease-out duration-300"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            {content}
        </Transition>
    );
};

// Static methods to use with react-toastify
NotificationToast.success = (message, options = {}) => {
    return toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options
    });
};

NotificationToast.error = (message, options = {}) => {
    return toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options
    });
};

NotificationToast.info = (message, options = {}) => {
    return toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options
    });
};

NotificationToast.warning = (message, options = {}) => {
    return toast.warning(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options
    });
};

export default NotificationToast;
