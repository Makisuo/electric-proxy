import { type FormApi, useForm } from "@tanstack/react-form"
import { type } from "arktype"
import { type ReactNode, useEffect } from "react"

import { Select } from "../ui"
import { Form, FormSelectField, FormTextArea } from "./form-components"

const algs = [
	{ id: "RS256", name: "RS256" },
	{ id: "PS256", name: "PS256" },
	{ id: "EdDSA", name: "EdDSA" },
	{ id: "ES256", name: "ES256" },
]

export const authorizationSchema = type({
	publicKey: "string",
	alg: "string",
})

export interface AuthorizationFormProps {
	onSubmit: (jwt: {
		value: typeof authorizationSchema.infer
		formApi: FormApi<typeof authorizationSchema.infer>
	}) => Promise<void>
	initialValues?: typeof authorizationSchema.infer

	children: ReactNode
}

export const AuthorizationForm = ({ onSubmit, initialValues, children }: AuthorizationFormProps) => {
	const form = useForm({
		onSubmit: onSubmit,
		validators: {
			onChange: authorizationSchema,
		},
		asyncDebounceMs: 400,
		defaultValues: initialValues || {
			alg: "RS256",
			publicKey: undefined!,
		},
	})

	useEffect(() => {
		form.reset(
			initialValues || {
				alg: "RS256",
				publicKey: undefined!,
			},
		)
	}, [initialValues, form.reset])

	return (
		<Form form={form} className="flex w-full flex-col gap-6">
			<form.Field
				name="publicKey"
				children={(field) => <FormTextArea label="Public Key" isRequired field={field} />}
			/>
			<form.Field
				name="alg"
				children={(field) => (
					<FormSelectField label="Alg" isRequired field={field}>
						<Select.Trigger />
						<Select.List items={algs}>
							{(item) => (
								<Select.Option id={item.id} textValue={item.name}>
									{item.name}
								</Select.Option>
							)}
						</Select.List>
					</FormSelectField>
				)}
			/>

			{children}
		</Form>
	)
}
