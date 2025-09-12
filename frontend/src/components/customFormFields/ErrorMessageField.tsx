import { ErrorMessage } from "@hookform/error-message";
import { useFormContext } from "react-hook-form";

type ErrorMessageFieldProps = {
  name: string;
  as?: string;
};


/**
 * * ErrorMessageField
 * A reusable component to display multiple validation errors for a specific
 * field in a React Hook Form. It leverages the @hookform/error-message
 * package and automatically handles multiple validation messages.
 */
export const ErrorMessageField: React.FC<ErrorMessageFieldProps> = ({ name, as="p" }) => {
  const { formState: { errors } } = useFormContext();

  return (
    <ErrorMessage
      as={as}
      name={name}
      errors={errors}
      render={({ messages }) => {
        if (!messages) {
          return null
        }
        else{
          return (
            <>
              {Object.entries(messages).map(([type, message]) => (
                <div key={type} className="text-red-500 text-sm mt-1">
                  X {message}
                </div>
              ))}
            </>
          )
        }
      }}
    />
  );
};


