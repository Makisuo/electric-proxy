import type { ValidationError, Validator, ValidatorAdapterParams } from "@tanstack/form-core"
import { Either, Schema } from "effect"
import { ArrayFormatter, type ArrayFormatterIssue } from "effect/ParseResult"

type Params = ValidatorAdapterParams<ArrayFormatterIssue>
type TransformFn = NonNullable<Params["transformErrors"]>

export function prefixSchemaToErrors(schemaErrors: ArrayFormatterIssue[], transformErrors: TransformFn) {
	const schema = new Map<string, ArrayFormatterIssue[]>()

	for (const schemaError of schemaErrors) {
		if (schemaError.path.length === 0) {
			continue
		}
		const path = schemaError.path
			.map((segment) => (typeof segment === "number" ? `[${segment}]` : segment))
			.join(".")
			.replace(/\.\[/g, "[")

		schema.set(path, (schema.get(path) ?? []).concat(schemaError))
	}
	const transformedSchema = {} as Record<string, ValidationError>

	schema.forEach((value, key) => {
		transformedSchema[key] = transformErrors(value)
	})

	return transformedSchema
}

export function defaultFormTransformer(transformErrors: TransformFn) {
	return (schemaErrors: ArrayFormatterIssue[]) => ({
		form: transformErrors(schemaErrors),
		fields: prefixSchemaToErrors(schemaErrors, transformErrors),
	})
}

export const effectValidator =
	(params: Params = {}): Validator<unknown, { schema: Schema.Schema<any, any, never> }> =>
	() => {
		const transformFieldErrors =
			params.transformErrors ??
			((errors: ArrayFormatterIssue[]) => errors.map((error) => error.message).join(", "))

		const getTransformStrategy = (validationSource: "form" | "field") =>
			validationSource === "form" ? defaultFormTransformer(transformFieldErrors) : transformFieldErrors

		console.log("VALIDATOR")
		return {
			validate({ value, validationSource }, { schema }) {
				const res = Schema.decodeUnknownEither(schema)(value, { errors: "all" }).pipe(
					Either.mapLeft((error) => ArrayFormatter.formatErrorSync(error)),
				)

				console.log("validate", res)
				if (Either.isLeft(res)) {
					const transformer = getTransformStrategy(validationSource)

					return transformer(res.left)
				}

				return
			},
			async validateAsync({ value, validationSource }, { schema }) {
				const res = Schema.decodeUnknownEither(schema)(value, { errors: "all" }).pipe(
					Either.mapLeft((error) => ArrayFormatter.formatErrorSync(error)),
				)

				console.log("validate async", res)
				if (Either.isLeft(res)) {
					const transformer = getTransformStrategy(validationSource)

					return transformer(res.left)
				}

				return
			},
		}
	}
