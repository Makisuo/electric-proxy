import { HttpApiMiddleware, HttpApiSecurity } from "@effect/platform"
import { Context, Schema } from "effect"
import { Unauthorized } from "./errors"

export const TenantId = Schema.String.pipe(Schema.brand("TenantId"))
export type TenantId = typeof TenantId.Type

export class User extends Schema.Class<User>("User")({ tenantId: TenantId }) {}
class CurrentUser extends Context.Tag("CurrentUser")<CurrentUser, User>() {}

export class Authorization extends HttpApiMiddleware.Tag<Authorization>()("Authorization", {
	failure: Unauthorized,
	provides: CurrentUser,
	security: {
		bearer: HttpApiSecurity.bearer,
	},
}) {}
