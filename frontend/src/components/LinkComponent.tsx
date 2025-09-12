import type { LinkProps } from "next/link";
import Link from "next/link";

type LinkComponentProps = LinkProps & {
    link_text: string
    href: string
	className?: string
}

/**
 * * LinkComponent
 * A reusable wrapper around Next.js `Link` component with default styling.
 * Adds a blue color and underline, while allowing custom classes via `className`.
 *
 * Usage:
 * <LinkComponent link_text="Go to Home" href="/" />
 */
export const LinkComponent: React.FC<LinkComponentProps> = ({link_text, href, className}) => {
	// Combine default and optional custom classes
	const classString = `text-blue-500 underline ${className}`
	
	return (
		<Link
			href={href}
			className={classString}>
			{link_text}
		</Link>
	);
};
