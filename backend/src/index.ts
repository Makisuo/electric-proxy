import { HttpApiBuilder, HttpMiddleware } from "@effect/platform"
import { Layer, pipe } from "effect"

import { AuthorizationLive } from "./api"
import { HttpAppLive } from "./http"

declare global {
	var env: Env
}

const HttpLive = Layer.mergeAll(HttpAppLive).pipe(Layer.provide(AuthorizationLive))

export default {
	async fetch(request, env): Promise<Response> {
		Object.assign(globalThis, {
			env,
		})

		// @ts-expect-error
		Object.assign(process, {
			env,
		})

		const handler = HttpApiBuilder.toWebHandler(HttpLive, {
			middleware: pipe(HttpMiddleware.logger),
		})

		return handler.handler(request)
	},
} satisfies ExportedHandler<Env>
