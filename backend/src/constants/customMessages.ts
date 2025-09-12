/**
 * * 📢 Custom Messages
 * ? Centralized collection of reusable user-facing messages.
 * ? Keeps the codebase clean & consistent by avoiding hardcoded strings everywhere.
 */
export const customMsg = {
    // 🔐 Authentication related messages
    auth: {
        invalid: "Please select a valid role",
        login_fail: "Authentication failed",
    },

    // 🌍 Common, generic messages for multiple use-cases
    common: {
        error: "Something went wrong, please try again",
        invalid: "Invalid input",
        loading: "Please wait...",
        not_allowed: "Action not allowed",
        not_found: "Data not found",
        required: "This field is required",
        success: "Operation completed successfully",
        unauthorized: "You are not authorized to perform this action",
    },

    // 🔑 Password confirmation messages
    confirm_password: {
        empty: "Please confirm your password",
        mismatch: "Passwords do not match",
    },

    // 📧 Email validation messages
    email: {
        exists: "Email is already registered",
        invalid: "Invalid email format",
        not_found: "Email not found",
        require: "Email is required",
        too_long: "Email is too long",
        too_short: "Email is too short",
    },

    // 🏷️ Name validation messages
    name: {
        require: "Name is required",
        too_long: "Name cannot exceed 50 characters",
        too_short: "Name must be at least 2 characters",
    },

    // 🔒 Password validation messages
    password: {
        incorrect: "Password is incorrect",
        invalid: "Invalid password",
        require: "Password is required",
        too_long: "Password cannot exceed 50 characters",
        too_short: "Password must have at least 8 characters",
        weak: "Password is too weak — use min 8 chars having at least one uppercase, one lowercase, one number and one special char",
    },

    // 👥 Role validation messages
    role: {
        empty: "Please provide role",
        invalid: "Please select a valid role",
    },
};
