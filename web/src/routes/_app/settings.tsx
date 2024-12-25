import { createFileRoute } from "@tanstack/react-router"
import { IconPersonPasskey } from "justd-icons"
import { Button } from "~/components/ui"
import { authClient } from "~/lib/auth"

export const Route = createFileRoute("/_app/settings")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<Button
				onPress={async () => {
					await authClient.passkey.addPasskey()
				}}
			>
				<IconPersonPasskey />
				Add Passkey
			</Button>
		</div>
	)
}
