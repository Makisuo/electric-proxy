import { D1Client } from "@effect/sql-d1"
import { Config, Effect, String as EffectString, Layer } from "effect"

const D1Live = Layer.unwrapEffect(
	Effect.gen(function* () {
		const db = globalThis.env.DB
		return D1Client.layerConfig({
			db: Config.succeed(db),
			transformQueryNames: Config.succeed(EffectString.camelToSnake),
			transformResultNames: Config.succeed(EffectString.snakeToCamel),
		})
	}),
)

export const SqlLive = D1Live.pipe()
