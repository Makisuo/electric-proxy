import { IconPersonPasskey } from "justd-icons"
import { useTransition } from "react"
import { Button, Loader } from "~/components/ui"
import { authClient } from "~/lib/auth"

export const PasskeySignIn = () => {
	const [isPending, startTransition] = useTransition()

	return (
		<Button
			ref={() => {
				if (
					!PublicKeyCredential.isConditionalMediationAvailable ||
					!PublicKeyCredential.isConditionalMediationAvailable()
				) {
					return
				}

				void authClient.signIn.passkey({ autoFill: true })
			}}
			onPress={() => {
				startTransition(async () => {
					await authClient.signIn.passkey({})
				})
			}}
			appearance="outline"
			isPending={isPending}
			className="w-full"
			type="submit"
		>
			{({ isPending }) => (
				<>
					{isPending ? (
						<Loader className="size-4" variant="spin" />
					) : (
						<div className="flex items-center gap-2">
							<IconPersonPasskey />
							<span>
								<span className="hidden sm:inline">Sign in with </span>Passkey
							</span>
						</div>
					)}
				</>
			)}
		</Button>
	)
}
