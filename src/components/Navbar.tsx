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
					<div className="flex items-center space-x-4">
						<Link
							href="/submit"
							className="px-4 py-2 rounded-md hover:bg-muted transition-colors duration-200"
						>
							Submit
						</Link>
						<ModeToggle />
					</div>
				</div>
			</div>
		</nav>
	);
}
