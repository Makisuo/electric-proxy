import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/$id")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/_app/$id"!</div>
}
