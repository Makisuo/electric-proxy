import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { AppLayout } from "~/components/app-layout"
import { LoadingScreen } from "~/components/loading-screen"
import { getApi } from "~/lib/api/client"

export const Route = createFileRoute("/_app")({
	component: () => {
		return <InnerComponent />
	},
	beforeLoad: async ({ context, location }) => {
		if (!context.auth.isSignedIn && context.auth.isLoaded) {
			throw redirect({
				to: "/auth/login/$",
				search: {
					redirect: location.href,
				},
			})
		}

		const api = getApi(context.auth.getToken)

		await context.queryClient.prefetchQuery(api.queryOptions("get", "/apps"))
	},
	loader: LoadingScreen,
})

const InnerComponent = () => {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	)
}
