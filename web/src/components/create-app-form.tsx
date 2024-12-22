import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useApi } from "~/lib/api/client"
import { AppForm } from "./app-form"
import { Button } from "./ui"

export const CreateAppForm = () => {
	const nav = useNavigate()
	const $api = useApi()

	const queryClient = useQueryClient()

	const queryOptionsGetApps = $api.queryOptions("get", "/apps")

	const createApp = $api.useMutation("post", "/app", {
		onSuccess: (app) => {
			const queryOptions = $api.queryOptions("get", "/app/{id}", { params: { path: { id: app.id } } })

			queryClient.setQueryData(queryOptions.queryKey, app)
			queryClient.setQueryData(queryOptionsGetApps.queryKey, (old: any[]) => [...old, app])
			nav({ to: "/$id", params: { id: app.id } })
		},
	})

	return (
		<AppForm
			onSubmit={async ({ value }) => {
				toast.promise(
					createApp.mutateAsync({
						body: value,
					}),
					{
						loading: "Creating App...",
						success: "Created App",
						error: (error) => error.message,
					},
				)
			}}
		>
			<Button className={"mb-4"} type="submit" slot="close">
				Create
			</Button>
		</AppForm>
	)
}
