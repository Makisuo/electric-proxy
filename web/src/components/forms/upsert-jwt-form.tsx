import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useApi } from "~/lib/api/client"
import { Button } from "../ui"
import { AuthorizationForm, type InsertJwtData } from "./authorization-form"

export type UpsertJwtFormProps = {
	appId: string
	jwt: InsertJwtData | null
}

export const UpsertJwtForm = ({ appId, jwt }: UpsertJwtFormProps) => {
	const $api = useApi()

	const queryClient = useQueryClient()

	const upsertJwt = $api.useMutation("post", "/app/{id}/jwt", {
		onSuccess: (jwt) => {
			const queryOptions = $api.queryOptions("get", "/app/{id}", { params: { path: { id: appId } } })

			const queryData = queryClient.getQueryData(queryOptions.queryKey)

			queryClient.setQueryData(queryOptions.queryKey, {
				...(queryData as any),
				jwt,
			})
		},
	})

	return (
		<AuthorizationForm
			initialValues={jwt || undefined}
			onSubmit={async (value) => {
				toast.promise(
					upsertJwt.mutateAsync({
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
				Update
			</Button>
		</AuthorizationForm>
	)
}
