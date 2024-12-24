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
					await authClient.signIn.social({
						provider: "github",
						fetchOptions: {
							onResponse: (ctx) => {
								const authToken = ctx.response.headers.get("set-auth-token")

								console.log(ctx.response.headers, authToken, ctx, "COOL")
								if (authToken) {
									console.log("setting bearer token")
									localStorage.setItem("bearer_token", authToken)
								}
							},
						},
					})
				}
			>
				Test
			</Button>
		</div>
	)
}
