import { type ReactNode, useNavigate } from "@tanstack/react-router"
import { IconBrandGithub, IconBrandGoogle } from "justd-icons"
import { useTransition } from "react"
import { Button, Loader } from "~/components/ui"
import { authClient } from "~/lib/auth"

export type OAuthProvider = "github" | "google"

export interface OAuthButtonProps {
	provider: OAuthProvider
	redirect?: string
}

const providers = {
	github: {
		icon: <IconBrandGithub className="size-4" />,
		label: "GitHub",
	},
	google: {
		icon: <IconBrandGoogle />,
		label: "Google",
	},
} satisfies Record<OAuthProvider, { icon: ReactNode; label: string }>

export const OAuthButton = ({ provider, redirect }: OAuthButtonProps) => {
	const navigate = useNavigate()
	const { icon, label } = providers[provider]
	const [isPending, startTransition] = useTransition()

	return (
		<Button
			className="w-full"
			isPending={isPending}
			intent="secondary"
			onPress={() => {
				startTransition(async () => {
					await authClient.signIn.social({
						provider,

						fetchOptions: {
							onSuccess: async () => {
								await navigate({ to: "/" })
							},
						},
					})
				})
			}}
		>
			{({ isPending }) => (
				<>
					{isPending ? <Loader className="size-4" variant="spin" /> : icon}
					{label}
				</>
			)}
		</Button>
	)
}
