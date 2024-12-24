import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { Container } from "~/components/ui"
import { AuthProvider } from "./-components/auth-provider"

export const Route = createFileRoute("/auth/_layout")({
	beforeLoad: ({ context }) => {
		// if (context.auth) {
		// 	throw redirect({
		// 		to: "/",
		// 	})
		// }
	},
	component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
	return (
		<Container className="flex min-h-screen items-center justify-center">
			<AuthProvider>
				<Outlet />
			</AuthProvider>
		</Container>
	)
}
