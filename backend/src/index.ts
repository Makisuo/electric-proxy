import { HttpApiBuilder, HttpMiddleware } from "@effect/platform"
import { Layer, pipe } from "effect"

import { AuthorizationLive } from "./api"
import { HttpAppLive } from "./http"

declare global {
	var env: Env
	var waitUntil: (promise: Promise<any>) => Promise<void>
}

const HttpLive = Layer.mergeAll(HttpAppLive).pipe(Layer.provide(AuthorizationLive))

export default {
	async fetch(request, env, ctx): Promise<Response> {
		Object.assign(globalThis, {
			env,
			waitUntil: ctx.waitUntil,
		})

		Object.assign(process, {
			env,
		})

		const handler = HttpApiBuilder.toWebHandler(HttpLive, {
			middleware: pipe(HttpMiddleware.logger),
		})

		return handler.handler(request)
	},
} satisfies ExportedHandler<Env>
