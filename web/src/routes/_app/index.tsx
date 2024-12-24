import { Link, createFileRoute } from "@tanstack/react-router"

import { CreateAppForm } from "~/components/create-app-form"
import { Button, Card } from "~/components/ui"
import { useApi } from "~/lib/api/client"
import { authClient } from "~/lib/auth"

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
})

function RouteComponent() {
	const api$ = useApi()
	const { data } = api$.useQuery("get", "/apps")

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
						<Card.Header title={app.name} description="Clerk Auth" />
						<Card.Content />
					</Card>
				</Link>
			))}
			<Button
				onPress={async () =>
					console.log(
						await authClient.signIn.social({
							provider: "github",
						}),
					)
				}
			>
				Test
			</Button>
		</div>
	)
}
