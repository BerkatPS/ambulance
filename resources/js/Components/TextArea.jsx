import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextArea(
    { className = '', isFocused = false, ...props },
    ref
) {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (isFocused) {
            textareaRef.current.focus();
        }
    }, [isFocused]);

    return (
        <textarea
            {...props}
            className={
                'border-gray-300 focus:border-primary-500 focus:ring-primary-500 rounded-md shadow-sm ' +
                className
            }
            ref={ref || textareaRef}
        />
    );
});
