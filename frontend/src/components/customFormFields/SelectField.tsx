import type { customFieldTypes } from "#/types/customFieldTypes";

import { ErrorMessageField } from "#/components/customFormFields/ErrorMessageField";
import { generateLabel, generatePlaceholder } from "#/utils/formikHelpers";
import { useFormContext } from "react-hook-form";


type SelectFieldProps = customFieldTypes & {
    options: { value: string | number; label: string }[];
}


/**
 * * SelectField
 * A reusable dropdown (select) component integrated with React Hook Form.
 * Supports automatic label and placeholder generation, and
 * displays validation errors using ErrorMessageField.
 */
export const SelectField: React.FC<SelectFieldProps> = ({
    name,
    label,
    options,
    placeholder,
    className = "",
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
            <select
                id={name}
                className={classString}
                {...register(name)}
            >
                <option value="" disabled>{customPlaceholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ErrorMessageField name={name} />
            
        </div>
    );
};