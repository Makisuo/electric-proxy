import { HttpClientRequest } from "@effect/platform"
import { Match } from "effect"
import type { AuthSchema } from "shared/models/app"

export const genAuthHeader = Match.type<typeof AuthSchema.Type>().pipe(
	Match.when({ type: "basic" }, (auth) =>
		HttpClientRequest.setHeader("Authorization", `Basic ${btoa(`${auth.username}:${auth.password}`)}`),
	),
	Match.when({ type: "bearer" }, (auth) =>
		HttpClientRequest.setHeader("Authorization", `Bearer ${auth.credentials}`),
	),
	Match.when({ type: "electric-cloud" }, (auth) =>
		HttpClientRequest.setUrlParams(
			new URLSearchParams({ source_id: auth.sourceId, source_secret: auth.sourceSecret }),
		),
	),
	Match.exhaustive,
)
