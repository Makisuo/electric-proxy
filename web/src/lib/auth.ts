import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
	baseURL: `${import.meta.env.VITE_BACKEND_URL}/better-auth`,
	fetchOptions: {
		auth: {
			type: "Bearer",
			token: () => localStorage.getItem("bearer_token") || "",
		},
		onSuccess: (ctx) => {
			const authToken = ctx.response.headers.get("set-auth-token")

			ctx.response.headers.forEach((value, header) => {
				console.log(`${header}: ${value}`)
			})

			console.log(authToken, ctx, "Global")
			if (authToken) {
				console.log("setting bearer token")
				localStorage.setItem("bearer_token", authToken)
			}
		},
	},
})

export const { signIn, signOut, signUp, useSession } = authClient
