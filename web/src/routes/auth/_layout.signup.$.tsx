import { SignUp } from "@clerk/clerk-react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/_layout/signup/$")({
	component: () => <SignUp path="/auth/signup" />,
})
