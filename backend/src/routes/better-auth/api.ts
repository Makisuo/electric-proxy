import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"

export class BetterAuthApi extends HttpApiGroup.make("BetterAuth")
	.add(HttpApiEndpoint.get("betterAuthGet", "/better-auth/*"))
	.add(HttpApiEndpoint.post("betterAuthPost", "/better-auth/*")) {}
