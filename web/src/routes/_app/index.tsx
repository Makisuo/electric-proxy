import { Link, createFileRoute } from "@tanstack/react-router"

import { Card } from "~/components/ui"
import { useApi } from "~/lib/api/client"

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
})

function RouteComponent() {
	const api$ = useApi()
	const { data } = api$.useSuspenseQuery("get", "/apps")

	return (
		<div className="flex gap-3">
			{data?.map((app) => (
				<Link
					to="/$id"
					params={{
						id: app.id,
					}}
					className="w-full"
					key={app.id}
				>
					<Card className="w-full">
						<Card.Header title={app.name} />
						<Card.Content />
					</Card>
				</Link>
			))}
		</div>
	)
}
