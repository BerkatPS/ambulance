import React from 'react';

export default function SelectInput({
    disabled = false,
    className = '',
    options = [],
    value,
    onChange,
    required = false,
    name,
    id,
    ...props
}) {
    return (
        <select
            name={name}
            id={id}
            value={value}
            className={
                `border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm ` +
                className
            }
            disabled={disabled}
            onChange={onChange}
            required={required}
            {...props}
        >
            <option value="">-- Pilih Opsi --</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
