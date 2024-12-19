import { createFileRoute } from "@tanstack/react-router"

import { CreateAppForm } from "~/components/create-app-form"

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
})

function RouteComponent() {
	return <CreateAppForm />
}
