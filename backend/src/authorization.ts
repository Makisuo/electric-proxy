import { HttpApiMiddleware, HttpApiSecurity } from "@effect/platform"
import { Context, Schema } from "effect"
import { Unauthorized } from "./errors"

import { TenantId } from "shared/models/user"

export class User extends Schema.Class<User>("User")({ tenantId: TenantId }) {}
export class CurrentUser extends Context.Tag("CurrentUser")<CurrentUser, User>() {}

export class Authorization extends HttpApiMiddleware.Tag<Authorization>()("Authorization", {
	failure: Unauthorized,
	provides: CurrentUser,
	security: {
		bearer: HttpApiSecurity.bearer,
	},
}) {}
