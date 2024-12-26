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

		const origin = request.headers.get("Origin")

		const handler = HttpApiBuilder.toWebHandler(HttpLive, {
			middleware: pipe(HttpMiddleware.logger),
		})

		const res = await handler.handler(request)

		res.headers.set("Access-Control-Allow-Origin", origin || "*")
		return res
	},
} satisfies ExportedHandler<Env>
