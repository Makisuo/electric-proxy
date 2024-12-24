import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { AppLayout } from "~/components/app-layout"
import { getApi } from "~/lib/api/client"

export const Route = createFileRoute("/_app")({
	component: () => {
		return <InnerComponent />
	},

	beforeLoad: async ({ context, location }) => {
		if (!context.auth) {
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
