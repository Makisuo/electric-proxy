import { SignIn } from "@clerk/clerk-react"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/_layout/login/$")({
	component: LoginPage,
})

function LoginPage() {
	return <SignIn path="/auth/login" />
}
