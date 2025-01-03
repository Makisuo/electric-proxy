import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema, OpenApi } from "@effect/platform"
import { Schema } from "effect"
import { Authorization } from "~/authorization"
import { InvalidDuration, Unauthorized } from "~/errors"

import { UniqueSchema } from "~/services/analytics"

import { App, AppId, AppNotFound } from "shared/models/app"
import { Jwt } from "shared/models/jwt"

export class AppApi extends HttpApiGroup.make("App")
	.add(
		HttpApiEndpoint.post("createApp", "/app")
			.annotate(OpenApi.Summary, "Create a new app")
			.setPayload(App.jsonCreate)
			.addSuccess(App.json),
	)
	.add(
		HttpApiEndpoint.post("upsertJwt", "/app/:id/jwt")
			.setPath(
				Schema.Struct({
					id: AppId,
				}),
			)
			.setPayload(Jwt.jsonUpdate)
			.addSuccess(Jwt.json),
	)
	.add(HttpApiEndpoint.get("getApps", "/apps").addSuccess(Schema.Array(App.json)))
	.add(
		HttpApiEndpoint.get("getApp", "/app/:id")
			.setPath(
				Schema.Struct({
					id: AppId,
				}),
			)
			.addSuccess(Schema.Struct({ ...App.json.fields, jwt: Schema.NullOr(Jwt.json) }))
			.addError(AppNotFound)
			.addError(Unauthorized),
	)
	.add(
		HttpApiEndpoint.put("updateApp", "/app/:id")
			.setPath(
				Schema.Struct({
					id: AppId,
				}),
			)
			.setPayload(App.jsonUpdate)
			.addSuccess(App.json)
			.addError(AppNotFound),
	)
	.add(
		HttpApiEndpoint.del("deleteApp", "/app/:id")
			.addError(AppNotFound)
			.setPath(Schema.Struct({ id: AppId })),
	)
	.add(
		HttpApiEndpoint.get("getAnalytics", "/app/:id/analytics")
			.setPath(
				Schema.Struct({
					id: AppId,
				}),
			)
			.setUrlParams(
				Schema.Struct({
					duration: Schema.optional(Schema.String),
				}),
			)
			.addError(InvalidDuration)
			.addSuccess(Schema.Array(UniqueSchema)),
	)
	.middlewareEndpoints(Authorization) {}
