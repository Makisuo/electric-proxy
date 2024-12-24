import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { AppLayout } from "~/components/app-layout"
import { getApi } from "~/lib/api/client"
import { authClient } from "~/lib/auth"

export const Route = createFileRoute("/_app")({
	component: () => {
		return <InnerComponent />
	},

	beforeLoad: async ({ context, location }) => {
		const session = await authClient.getSession()

		if (!session.data) {
			throw redirect({
				to: "/auth/signin",
				search: {
					redirect: location.href,
				},
			})
		}

		const api = getApi()

		await context.queryClient.prefetchQuery(api.queryOptions("get", "/apps"))
	},
})

const InnerComponent = () => {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	)
}
