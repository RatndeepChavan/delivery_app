"use client"

import { useRouter } from "next/navigation";

/**
 * * BackButton
 * A reusable button component that navigates the user back to the previous page
 * using Next.js' useRouter hook.
 *
 * Usage:
 * <BackButton />
 */
export const BackButton = () => {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()} // Go back to previous page
            className="bg-gray-500 text-white px-4 py-2 rounded">
            Back
        </button>
    );
};
