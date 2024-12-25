import { oneTapClient, passkeyClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
	baseURL: `${import.meta.env.VITE_BACKEND_URL}/better-auth`,
	plugins: [
		oneTapClient({
			clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
		}),
		passkeyClient(),
	],
})

export const { signIn, signOut, signUp, useSession } = authClient
