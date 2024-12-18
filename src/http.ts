import { HttpApiBuilder, HttpApiScalar, HttpServer } from "@effect/platform"
import { Layer, LogLevel, Logger, pipe } from "effect"
import { Api } from "./api"
import { HttpAppRouteLive } from "./routes/app/http"
import { HttpElectricLive } from "./routes/electric/http"
import { HttpRootLive } from "./routes/root/http"

export const ApiLive = Layer.provide(HttpApiBuilder.api(Api), [HttpRootLive, HttpElectricLive, HttpAppRouteLive])

export const HttpAppLive = pipe(
	HttpApiBuilder.Router.Live,
	Layer.provide(HttpApiScalar.layer()),
	Layer.provideMerge(HttpApiBuilder.middlewareOpenApi()),
	Layer.provideMerge(HttpApiBuilder.middlewareCors()),
	Layer.provideMerge(HttpServer.layerContext),
	Layer.provideMerge(ApiLive),

	Layer.provide(Logger.minimumLogLevel(LogLevel.All)),
	Layer.provide(Logger.structured),
)
