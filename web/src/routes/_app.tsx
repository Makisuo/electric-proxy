import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { AppLayout } from "~/components/app-layout"

export const Route = createFileRoute("/_app")({
	component: () => {
		return <InnerComponent />
	},
	beforeLoad: ({ context, location }) => {
		if (!context.auth.isSignedIn && context.auth.isLoaded) {
			throw redirect({
				to: "/auth/login/$",
				search: {
					redirect: location.href,
				},
			})
		}
	},
})

const InnerComponent = () => {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	)
}
