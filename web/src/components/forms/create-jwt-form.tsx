import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useApi } from "~/lib/api/client"
import { Button } from "../ui"
import { AppForm } from "./app-form"
import { AuthorizationForm } from "./authorization-form"

export type CreateJwtFormProps = {
	appId: string
}

export const CreateJwtForm = ({ appId }: CreateJwtFormProps) => {
	const nav = useNavigate()
	const $api = useApi()

	const queryClient = useQueryClient()

	const createJwt = $api.useMutation("post", "/app/{id}/jwt", {
		onSuccess: (app) => {
			const queryOptions = $api.queryOptions("get", "/app/{id}", { params: { path: { id: app.id } } })

			queryClient.setQueryData(queryOptions.queryKey, app)
			nav({ to: "/$id", params: { id: app.id } })
		},
	})

	return (
		<AuthorizationForm
			onSubmit={async ({ value }) => {
				toast.promise(
					createJwt.mutateAsync({
						params: {
							path: {
								id: appId,
							},
						},
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
			<Button className={"mb-4"} type="submit">
				Create
			</Button>
		</AuthorizationForm>
	)
}
