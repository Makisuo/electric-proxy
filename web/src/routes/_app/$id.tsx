import { createFileRoute } from "@tanstack/react-router"
import { CopyField } from "~/components/copy-field"
import { DeleteAppDialog } from "~/components/delete-app-dialog"
import { Button, Card, Heading, Loader, Separator } from "~/components/ui"
import { UpdateAppForm } from "~/components/update-app-form"
import { useApi } from "~/lib/api/client"

export const Route = createFileRoute("/_app/$id")({
	component: RouteComponent,
	loader: ({ context }) => {},
})

function RouteComponent() {
	const $api = useApi()

	const { id } = Route.useParams()

	const { data, isLoading } = $api.useQuery("get", "/app/{id}", {
		params: {
			path: {
				id,
			},
		},
	})

	if (isLoading) {
		return (
			<div>
				<Loader />
			</div>
		)
	}

	if (!data) {
		return (
			<div>
				<h1>Not Found</h1>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-2 md:flex-row">
				<Heading level={1}>{data.name}</Heading>
				<CopyField value={`${import.meta.env.VITE_BACKEND_URL}/electric/${id}/v1/shape`} />
			</div>

			<Card>
				<Card.Header>
					<Card.Title>Update App</Card.Title>
				</Card.Header>
				<Card.Footer>
					<UpdateAppForm id={id} initalData={data} />
				</Card.Footer>
			</Card>
			<Separator />
			<Card>
				<Card.Header>
					<Card.Title>Destructive Actions</Card.Title>
					<Card.Description>These actions are irreversible</Card.Description>
				</Card.Header>
				<Card.Footer>
					<DeleteAppDialog id={id} />
				</Card.Footer>
			</Card>
		</div>
	)
}
