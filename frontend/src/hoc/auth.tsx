"use client";

import type { ComponentType } from "react";
import type { UserRoleType } from "#/enums/userRoles.enum";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react"
import { LinkComponent } from "#/components/LinkComponent";

type WithAuthOptions = {
	allowedRoles?: UserRoleType[];
};

/**
 * * Higher-Order Component (HOC) for Authentication and RBAC
 * Wrap pages or components requiring authentication and role-based access control.
 * 
 * @param WrappedComponent - The component to wrap with authentication check
 * @param options - Optional config, e.g., allowedRoles
 * @returns A new component that handles authentication and role checks
 */
export function WithAuth<P extends object>(
	WrappedComponent: ComponentType<P>,
	options: WithAuthOptions = {}
) {
	const { allowedRoles = [] } = options;

	function WithAuthComponent(props: P) {
		const { data: session } = useSession();
		const router = useRouter()

		// Redirect for invalid or expired session
		useEffect(() => {
			if (!session) {
				router.replace("/login");
			}

			const user = session?.user;
			if (!user){
				router.replace("/login");
			}
			else if (user && !allowedRoles.includes(user.role)) {
				router.replace("/");
			}
		}, [session, router])

		if (session) {
			const user = session?.user;
			// Implement role-based access control
			if (user && allowedRoles.includes(user.role)) {
				return <WrappedComponent {...props} />;
			} else {
				// ⚠️ Fallback if role is unknown
				return (
					<>
						<div>Fetching account details please wait else click below to login :</div>
						<LinkComponent link_text="login" href="/login" />
					</>
				)
			}
		} else {
			return <p>Loading session...</p>;
		}
	}

	return WithAuthComponent;
}
