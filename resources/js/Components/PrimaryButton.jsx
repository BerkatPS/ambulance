import { Link } from '@inertiajs/react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    as = 'button',
    href,
    ...props
}) {
    const classes = `inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 ${
        disabled && 'opacity-25'
    } ${className}`;

    if (as === 'link' && href) {
        return (
            <Link
                href={href}
                className={classes}
                {...props}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            {...props}
            className={classes}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
