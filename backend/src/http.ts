import { HttpApiBuilder, HttpApiScalar, HttpServer } from "@effect/platform"
import { Layer, LogLevel, Logger, pipe } from "effect"
import { Api } from "./api"
import { HttpAppRouteLive } from "./routes/app/http"
import { HttpAuthLive } from "./routes/auth/http"
import { HttpBetterAuthLive } from "./routes/better-auth/http"
import { HttpElectricLive } from "./routes/electric/http"
import { HttpRootLive } from "./routes/root/http"

export const ApiLive = Layer.provide(HttpApiBuilder.api(Api), [
	HttpRootLive,
	HttpElectricLive,
	HttpAppRouteLive,
	HttpAuthLive,
	HttpBetterAuthLive,
])

export const HttpAppLive = pipe(
	HttpApiBuilder.Router.Live,
	Layer.provide(HttpApiScalar.layer()),
	Layer.provideMerge(HttpApiBuilder.middlewareOpenApi()),
	Layer.provideMerge(
		HttpApiBuilder.middlewareCors({
			allowedOrigins: ["http://localhost:3001", "https://app.electric-auth.com"],
			credentials: true,
		}),
	),
	Layer.provideMerge(HttpServer.layerContext),
	Layer.provideMerge(ApiLive),

	Layer.provide(Logger.minimumLogLevel(LogLevel.All)),
	Layer.provide(Logger.structured),
)
