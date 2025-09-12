import type { customFieldTypes } from "#/types/customFieldTypes";

import { ErrorMessageField } from "#/components/customFormFields/ErrorMessageField";
import { generateLabel, generatePlaceholder } from "#/utils/formikHelpers";
import { useFormContext } from "react-hook-form";

type InputFieldProps = customFieldTypes & {
    type?: string;
}


/**
 * * InputField-
 * A reusable text input component integrated with React Hook Form.
 * Supports automatic label and placeholder generation, and
 * displays validation errors using ErrorMessageField.
 */
export const InputField: React.FC<InputFieldProps> = ({
    name,
    label,
    type = "text",
    placeholder,
    className = "",
}) => {
    // Access React Hook Form's context to register the input
    const { register } = useFormContext();

    // Generate label and placeholder if not provided
    const customLabel = label || generateLabel(name);
    const customPlaceholder = placeholder || generatePlaceholder(name, "input");

    // Combine default styles with optional custom classes
    const classString = `w-full border px-3 py-1 rounded ${className}`;

    return (
        <div className="mb-3">
            <label htmlFor={name} className="block mb-1 font-medium">
                {customLabel}
            </label>
            <input
                id={name}
                type={type}
                placeholder={customPlaceholder}
                className={classString}
                {...register(name)}
            />
            <ErrorMessageField name={name} />
        </div>
    );
};
