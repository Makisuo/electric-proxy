import { HttpApi, OpenApi } from "@effect/platform"
import { ElectricApi } from "./routes/electric/api"
import { RootApi } from "./routes/root/api"

export class Api extends HttpApi.make("api")
	.add(RootApi)
	.add(ElectricApi)
	.annotate(OpenApi.Title, "Electric Auth Proxy API") {}
