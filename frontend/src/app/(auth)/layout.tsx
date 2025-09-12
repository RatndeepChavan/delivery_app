import { ReactNode } from "react";

/**
 * * 🏗️ AuthLayout Component
 *
 * ? Provides a reusable layout for authentication pages (login, register)
 * ? Centers the content vertically and horizontally
 * ? Adds a max-width card style container with padding and rounded borders
 *
 * @param children - React nodes to render inside the layout
 */
const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-4 w-full max-w-md border border-gray-400 rounded-2xl">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout