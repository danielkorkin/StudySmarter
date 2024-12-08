import "@excalidraw/excalidraw/index.css";

export default async function SubjectLayout(props: {
	children: React.ReactNode;
	params: Promise<{ subjectId: string }>;
}) {
	const params = await props.params;

	const { children } = props;

	const { subjectId } = params;
	return (
		<div className="space-y-6">
			<main>{children}</main>
		</div>
	);
}
