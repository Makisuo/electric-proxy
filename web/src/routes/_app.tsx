import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

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
	return <Outlet />
}
