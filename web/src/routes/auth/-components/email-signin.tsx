import { useTransition } from "react"
import { Button, Checkbox, Form, Loader, TextField } from "~/components/ui"
import { authClient } from "~/lib/auth"

export const EmailSignIn = () => {
	const [isPending, startTransition] = useTransition()

	return (
		<Form
			className="space-y-3"
			onSubmit={(e) => {
				e.preventDefault()

				startTransition(async () => {
					const formData = new FormData(e.currentTarget)

					await authClient.signIn.email({
						email: formData.get("email") as string,
						password: formData.get("password") as string,
					})
				})
			}}
		>
			<TextField isRequired name="email" label="Email" type="email" autoComplete="email" />
			<TextField
				isRequired
				name="password"
				label="Password"
				type="password"
				autoComplete="current-password"
				isRevealable
			/>
			<Checkbox label="Remember me" />
			<Button isPending={isPending} className="w-full" type="submit">
				{({ isPending }) => <>{isPending ? <Loader className="size-4" variant="spin" /> : "Login"}</>}
			</Button>
		</Form>
	)
}
