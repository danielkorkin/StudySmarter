import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
	return (
		<nav className="bg-background border-b">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<Link href="/" className="text-2xl font-bold">
						StudySmarter
					</Link>
					<ModeToggle />
				</div>
			</div>
		</nav>
	);
}
