import { HttpApiSchema } from "@effect/platform"
import { Effect, Predicate, Schema } from "effect"
import { CurrentUser } from "./authorization"

import { TenantId } from "shared/models/user"

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
	"Unauthorized",
	{
		actorId: TenantId,
		entity: Schema.String,
		action: Schema.String,
	},
	HttpApiSchema.annotations({ status: 403 }),
) {
	get message() {
		return `Actor (${this.actorId}) is not authorized to perform action "${this.action}" on entity "${this.entity}"`
	}

	static is(u: unknown): u is Unauthorized {
		return Predicate.isTagged(u, "Unauthorized")
	}

	static refail(entity: string, action: string) {
		return <A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A, Unauthorized, CurrentUser | R> =>
			Effect.catchIf(
				effect,
				(e) => !Unauthorized.is(e),
				() =>
					Effect.flatMap(
						CurrentUser,
						(actor) =>
							new Unauthorized({
								actorId: actor.tenantId,
								entity,
								action,
							}),
					),
			) as any
	}
}
