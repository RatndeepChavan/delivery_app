import type { ButtonHTMLAttributes } from 'react'

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string;
    loading: boolean;
    className?: string; 
    type?: string;
}

/**
 * * SubmitButton Component
 * A reusable button component for forms with built-in loading state.
 *
 * Features:
 * - Shows a custom label or "Please wait..." when loading.
 * - Disabled automatically when `loading` is true.
 * - Accepts standard button props via `ButtonHTMLAttributes`.
 * - Supports additional custom CSS via `className`.
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({label, loading, className, type="submit"}) => {
    // Compose the full class string with optional custom classes
    const classString = `w-full bg-green-500 text-black font-bold p-2 rounded hover:bg-green-600 disabled:cursor-not-allowed ${className}`;
    
    return (
        <button
            type={type}
            className={classString}
            disabled={loading}
        >
            { loading ? "Please wait..." : label }
        </button>
    )
}