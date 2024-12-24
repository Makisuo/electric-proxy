import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { AppLayout } from "~/components/app-layout"
import { getApi } from "~/lib/api/client"
import { authQueryOptions } from "~/lib/use-auth"

export const Route = createFileRoute("/_app")({
	component: () => {
		return <InnerComponent />
	},

	beforeLoad: async ({ context, location }) => {
		const session = await context.queryClient.ensureQueryData(authQueryOptions)

		if (!session) {
			throw redirect({
				to: "/auth/signin",
				search: {
					redirect: location.href,
				},
			})
		}
	},
	loader: async ({ context: { queryClient } }) => {
		const api = getApi()

		const data = await queryClient.ensureQueryData(api.queryOptions("get", "/apps"))

		return data
	},
})

const InnerComponent = () => {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	)
}
