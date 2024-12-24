import createFetchClient, { type Middleware } from "openapi-fetch"
import createClient from "openapi-react-query"
import type { paths } from "./v1"

const getToken = () => localStorage.getItem("bearer_token") || ""

export const getApi = () => {
	const authMiddleware: Middleware = {
		async onRequest({ request }) {
			request.headers.set("Authorization", `Bearer ${getToken()}`)
			return request
		},
	}

	const fetchClient = createFetchClient<paths>({
		baseUrl: import.meta.env.VITE_BACKEND_URL,
	})

	fetchClient.use(authMiddleware)

	const $api = createClient(fetchClient)

	return $api
}

export const useApi = () => {
	return getApi()
}
