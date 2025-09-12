import type { customFieldTypes } from "#/types/customFieldTypes";

import { ErrorMessageField } from "#/components/customFormFields/ErrorMessageField";
import { generateLabel, generatePlaceholder } from "#/utils/formikHelpers";
import { useFormContext } from "react-hook-form";

type TextareaFieldProps = customFieldTypes & {
    rows?: number;
}

/**
 * * TextareaField
 * A reusable multi-line textarea component integrated with React Hook Form.
 * Supports automatic label and placeholder generation, and displays validation errors.
 */
export const TextareaField: React.FC<TextareaFieldProps> = ({
    name,
    label,
    placeholder,
    className = "",
    rows = 4,
}) => {
    // Access React Hook Form's context
    const { register } = useFormContext();

    // Generate label and placeholder if not provided
    const customLabel = label || generateLabel(name);
    const customPlaceholder = placeholder || generatePlaceholder(name, "input");
    
    // Combine default styles with optional custom classes
    const classString = `w-full border px-3 py-2 rounded ${className}`;

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block mb-1 font-medium">
                {customLabel}
            </label>
            <textarea
                id={name}
                rows={rows}
                placeholder={customPlaceholder}
                className={classString}
                {...register(name)}
            />
            <ErrorMessageField name={name} />
        </div>
    );
};