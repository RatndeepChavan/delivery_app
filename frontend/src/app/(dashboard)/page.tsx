"use client";

import { UserRole } from "#/enums/userRoles.enum";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DeliveryDashboard from "./deliveryDashboard";
import CustomerDashboard from "./customerDashboard";
import { LinkComponent } from "#/components/LinkComponent";

const Dashboard = () => {
	// Fetch session info using NextAuth
	const { data: session, status } = useSession();
	const router = useRouter();

	// Redirect to login if user is not authenticated
	useEffect(() => {
		if (status === "unauthenticated" || !session) {
			router.replace("/login");
		}
	}, [status, session, router]);

	// Show loading state while session is being fetched
	if (status === "loading") {
		return <div>Loading...</div>;
	}

	// Extract user role
	const role = session?.user.role;

	// ✅ Render dashboard based on role
	if (role === UserRole.CUSTOMER) {
		return <CustomerDashboard />;
	} else if (role === UserRole.DELIVERY){
		return <DeliveryDashboard />;
	} else {
		// ⚠️ Fallback if role is unknown or session is incomplete
        return (
			<>
				<div>Fetching account details please wait else click below to login :</div>
				<LinkComponent link_text="login" href="/login" />
			</>
		)
    }
};

export default Dashboard;
