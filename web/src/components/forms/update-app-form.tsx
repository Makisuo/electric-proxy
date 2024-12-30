import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useApi } from "~/lib/api/client"
import { Button } from "../ui"
import { AppForm, type appSchema } from "./app-form"

export const UpdateAppForm = ({ id, initalData }: { id: string; initalData: typeof appSchema.infer }) => {
	const $api = useApi()

	const queryClient = useQueryClient()

	const queryOptions = $api.queryOptions("get", "/app/{id}", { params: { path: { id } } })
	const queryOptionsGetApps = $api.queryOptions("get", "/apps")

	const updateApp = $api.useMutation("put", "/app/{id}", {
		onMutate: async ({ body }) => {
			const previousApp = queryClient.getQueryData(queryOptions.queryKey)
			const previousApps = queryClient.getQueryData(queryOptionsGetApps.queryKey)

			await queryClient.cancelQueries(queryOptions)
			await queryClient.cancelQueries(queryOptionsGetApps)

			queryClient.setQueryData(queryOptions.queryKey, body)
			queryClient.setQueryData(queryOptionsGetApps.queryKey, (old: any[]) =>
				old.map((app) => (app.id === id ? body : app)),
			)

			return { previousApp, previousApps }
		},
		onError: (err, newApp, context: any) => {
			queryClient.setQueryData(queryOptions.queryKey, context.previousApp)
			queryClient.setQueryData(queryOptionsGetApps.queryKey, context.previousApps)
		},
		onSettled: () => {
			queryClient.invalidateQueries(queryOptionsGetApps)
			queryClient.invalidateQueries(queryOptions)
		},
	})

	return (
		<AppForm
			initialValues={initalData}
			onSubmit={async ({ value }) => {
				toast.promise(
					updateApp.mutateAsync({
						body: value,
						params: {
							path: {
								id: id,
							},
						},
					}),
					{
						loading: "Updating App...",
						success: "Updated App",
						error: (error) => error.message,
					},
				)
			}}
		>
			<Button type="submit">Update</Button>
		</AppForm>
	)
}
