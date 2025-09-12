"use client";

import { useSession, signOut } from "next-auth/react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const { data: session } = useSession();

	// Logout handler
	const handleLogout = () => {
		signOut({
			redirect: true,
			callbackUrl: "/login",
		});
	};

	return (
		<div className="min-h-screen flex flex-col">

			<header className="flex justify-between items-center bg-gray-800 text-white px-6 py-4">
				<div className="font-bold text-lg">
					{session?.user?.name ?? "User"}
				</div>
				<button
					onClick={handleLogout}
					className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
					Logout
				</button>
			</header>

			{/* Main Content */}
			<main className="flex-1 p-6">{children}</main>
		</div>
	);
}

export default DashboardLayout