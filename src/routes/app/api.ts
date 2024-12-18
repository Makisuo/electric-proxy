import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform"
import { App } from "~/models/app"

export class AppApi extends HttpApiGroup.make("App").add(
	HttpApiEndpoint.post("createApp", "/app")
		.annotate(OpenApi.Summary, "Create a new app")
		.setPayload(App.jsonCreate)
		.addSuccess(App.json),
) {}
