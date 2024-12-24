import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { authClient } from "./auth"

export const authQueryOptions = queryOptions({
	queryKey: ["auth"],
	queryFn: async () => {
		const { data, error } = await authClient.getSession()

		if (error) {
			return null
		}

		return data
	},
})

export const useAuth = () => useSuspenseQuery(authQueryOptions)
