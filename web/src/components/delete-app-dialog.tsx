import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useApi } from "~/lib/api/client"
import { Modal, buttonStyles } from "./ui"

export const DeleteAppDialog = ({ id }: { id: string }) => {
	const nav = useNavigate()
	const api$ = useApi()

	const queryClient = useQueryClient()

	const deleteApp = api$.useMutation("delete", "/api/app/{id}", {
		onSuccess: async () => {
			const queryOptionsGetApps = api$.queryOptions("get", "/api/apps")
			const queryOptionsGetApp = api$.queryOptions("get", "/api/app/{id}", { params: { path: { id } } })

			queryClient.setQueryData(queryOptionsGetApps.queryKey, (old: { id: string }[]) =>
				old.filter((app) => app.id !== id),
			)
			queryClient.setQueryData(queryOptionsGetApp.queryKey, () => null)

			nav({ to: "/" })
		},
	})

	return (
		<Modal>
			<Modal.Trigger className={buttonStyles({ intent: "danger" })}>Delete</Modal.Trigger>
			<Modal.Content role="alertdialog">
				<Modal.Header>
					<Modal.Title>Delete App</Modal.Title>
					<Modal.Description>This will permanently delete the app</Modal.Description>
				</Modal.Header>
				<Modal.Footer>
					<Modal.Close appearance="outline">Cancel</Modal.Close>
					<Modal.Close
						appearance="solid"
						intent="danger"
						onPress={() =>
							toast.promise(deleteApp.mutateAsync({ params: { path: { id } } }), {
								loading: "Deleting...",
								success: "Deleted",
								error: (error) => error.message,
							})
						}
					>
						Delete
					</Modal.Close>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	)
}
