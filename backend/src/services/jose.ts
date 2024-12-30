import { HttpApiSchema } from "@effect/platform"
import { Effect, Schema } from "effect"

import { importSPKI as internalImportSPKI, jwtVerify as internalJwtVerify } from "jose"
import { errors } from "jose"

export const JWT_ALG = Schema.Literal("RS256")
export const JWT = Schema.String.pipe(Schema.brand("JWT"))
export const JWT_PUBLIC_KEY = Schema.String.pipe(Schema.brand("JWT_PUBLIC_KEY"))

export class Jose extends Effect.Service<Jose>()("Jose", {
	effect: Effect.gen(function* () {
		const importSPKI = Effect.fn("Jose.importSPKI")(function* (
			publicKey: typeof JWT_PUBLIC_KEY.Type,
			alg: typeof JWT_ALG.Type,
		) {
			const pbKey = yield* Effect.tryPromise({
				try: () => internalImportSPKI(publicKey, alg),
				catch: () => {
					return new JoseError({ message: "Invalid Public Key" })
				},
			})

			return pbKey
		})

		const jwtVerify = Effect.fn("Jose.jwtVerify")(function* (
			publicKey: typeof JWT_PUBLIC_KEY.Type,
			jwt: typeof JWT.Type,
			alg: typeof JWT_ALG.Type,
		) {
			const pbKey = yield* importSPKI(publicKey, alg)

			return yield* Effect.tryPromise({
				try: () => internalJwtVerify(jwt, pbKey),
				catch: (e) => {
					if (e instanceof errors.JWTExpired) {
						return new JoseError({ message: "JWT Expired" })
					}
					return new JoseError({ message: "Invalid JWT" })
				},
			}).pipe(Effect.tapError(Effect.logError))
		})

		return {
			jwtVerify,
		} as const
	}),
}) {}

export class JoseError extends Schema.TaggedError<JoseError>()(
	"JoseError",
	{
		message: Schema.String,
	},
	HttpApiSchema.annotations({ status: 500 }),
) {}
