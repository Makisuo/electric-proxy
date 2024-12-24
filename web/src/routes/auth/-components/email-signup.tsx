import { useNavigate } from "@tanstack/react-router"
import { use, useTransition } from "react"
import { Button, Checkbox, Form, Loader, TextField } from "~/components/ui"
import { authClient } from "~/lib/auth"
import { AuthContext } from "./auth-provider"

export const EmailSignUp = () => {
	const navigate = useNavigate()
	const [isPending, startTransition] = useTransition()

	const authData = use(AuthContext)

	return (
		<Form
			className="space-y-3"
			onSubmit={(e) => {
				e.preventDefault()

				startTransition(async () => {
					const formData = new FormData(e.currentTarget)

					const firstName = formData.get("firstName") as string
					const lastName = formData.get("lastName") as string

					const email = formData.get("email") as string
					const password = formData.get("password") as string

					await authClient.signUp.email(
						{
							name: `${firstName} ${lastName}`,
							email,
							password,
						},
						{
							onSuccess: async () => {
								await navigate({ to: "/auth/success", search: { email } })
							},
							onError: (ctx) => {
								authData.setErrorMessage(ctx.error.message)
							},
						},
					)
				})
			}}
		>
			<div className="flex flex-col gap-3 md:flex-row">
				<TextField
					isRequired
					className="w-full"
					name="firstName"
					label="First Name"
					autoComplete="given-name"
				/>
				<TextField isRequired className="w-full" name="lastName" label="Last Name" autoComplete="family-name" />
			</div>
			<TextField isRequired name="email" label="Email" type="email" autoComplete="email" />
			<TextField
				isRequired
				name="password"
				label="Password"
				type="password"
				autoComplete="current-password"
				isRevealable
			/>
			<Checkbox name="remeberMe" label="Remember me" />
			<Button isPending={isPending} className="w-full" type="submit">
				{({ isPending }) => <>{isPending ? <Loader className="size-4" variant="spin" /> : "Login"}</>}
			</Button>
		</Form>
	)
}
