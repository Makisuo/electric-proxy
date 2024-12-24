import { Link, createFileRoute } from "@tanstack/react-router"
import { Card, Separator } from "~/components/ui"
import { EmailSignIn } from "./-components/email-signin"
import { OAuthButton } from "./-components/oauth-button"

export const Route = createFileRoute("/auth/_layout/signin")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Card className="w-md">
			<Card.Header title="Sign In" description="Enter your email below to login to your account" />
			<Card.Content className="space-y-4">
				<div className="flex flex-col gap-3 md:flex-row">
					<OAuthButton provider="github" />
					<OAuthButton provider="google" />
				</div>
				<Separator />
				<EmailSignIn />
			</Card.Content>
			<Card.Footer>
				<p className="text-muted-fg text-xs">
					Don't have an account?{" "}
					<Link to="/auth/signup" className={"font-semibold text-fg text-xs"}>
						Sign Up
					</Link>
				</p>
			</Card.Footer>
		</Card>
	)
}
