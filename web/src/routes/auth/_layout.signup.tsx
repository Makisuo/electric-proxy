import { Link, createFileRoute } from "@tanstack/react-router"
import { Card, Form, Separator, TextField } from "~/components/ui"
import { EmailSignUp } from "./-components/email-signup"
import { OAuthButton } from "./-components/oauth-button"

export const Route = createFileRoute("/auth/_layout/signup")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Card className="w-md">
			<Card.Header title="Sign Up" description="Enter your information to create an account" />
			<Card.Content className="space-y-4">
				<div className="flex flex-col gap-3 md:flex-row">
					<OAuthButton provider="github" />
					<OAuthButton provider="google" />
				</div>
				<Separator />
				<EmailSignUp />
			</Card.Content>
			<Card.Footer>
				<p className="text-muted-fg text-xs">
					Already have an account?{" "}
					<Link to="/auth/signin" className={"font-semibold text-fg text-xs"}>
						Sign In
					</Link>
				</p>
			</Card.Footer>
		</Card>
	)
}