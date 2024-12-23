import { FetchHttpClient, HttpBody, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { Config, Effect, Schema } from "effect"
import type { AppId } from "~/models/app"

const CLOUDFLARE_API = "https://api.cloudflare.com"

export class UniqueSchema extends Schema.Class<UniqueSchema>("UniqueSchema")({
	hour: Schema.String,
	uniqueUsers: Schema.NumberFromString,
	totalRequests: Schema.NumberFromString,
	errorCount: Schema.NumberFromString.annotations({
		jsonSchema: Schema.NumberFromString,
	}),
}) {}

export class UniqueSchemaRes extends Schema.Class<UniqueSchemaRes>("UniqueSchemaRes")({
	data: Schema.Array(UniqueSchema),
}) {}

export class Analytics extends Effect.Service<Analytics>()("Service/Analytics", {
	effect: Effect.gen(function* () {
		const defaultClient = yield* HttpClient.HttpClient
		const httpClient = defaultClient.pipe(HttpClient.filterStatusOk)

		const cloudflareSecretKey = yield* Config.string("CLOUDFLARE_SECRET_KEY")
		const cloudflareAccountId = yield* Config.string("CLOUDFLARE_ACCOUNT_ID")

		const getUnique = Effect.fn("Service/Analytics.getUnique")((appId: AppId) => {
			return HttpClientRequest.post(`/client/v4/accounts/${cloudflareAccountId}/analytics_engine/sql`).pipe(
				HttpClientRequest.prependUrl(CLOUDFLARE_API),
				HttpClientRequest.setBody(
					HttpBody.raw(`SELECT 
    toStartOfInterval(timestamp, INTERVAL '1' HOUR) as hour,
    COUNT(DISTINCT blob2) as uniqueUsers,
    COUNT() as totalRequests,
    SUM(IF(double1 < 200 OR double1 >= 300, 1, 0)) as errorCount
FROM electric 
WHERE 

timestamp >= NOW() - INTERVAL '12' HOUR 
GROUP BY hour 
ORDER BY hour DESC
`),
				),
				HttpClientRequest.setHeader("Authorization", `Bearer ${cloudflareSecretKey}`),
				httpClient.execute,
				Effect.timeout("15 seconds"),

				Effect.flatMap(HttpClientResponse.schemaBodyJson(UniqueSchemaRes)),
				Effect.scoped,
			)
		})

		return {
			getUnique,
		} as const
	}),
	dependencies: [FetchHttpClient.layer],
}) {}
