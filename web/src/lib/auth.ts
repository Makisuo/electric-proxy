import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
	baseURL: `${import.meta.env.VITE_BACKEND_URL}/better-auth`,
})

export const { signIn, signOut, signUp, useSession } = authClient
