import { type FormApi, useForm } from "@tanstack/react-form"
import { type } from "arktype"
import type { ReactNode } from "react"

import { Select } from "../ui"
import { Form, FormSelectField, FormTextArea, FormTextField } from "./form-components"

const algs = [{ id: "RS256", name: "RS256" }]

export const authorizationSchema = type({
	publicKey: "string",
	alg: '"RS256"',
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
			publicKey: null!,
		},
	})

	return (
		<Form form={form} className="flex w-full flex-col gap-6">
			<form.Field
				name="publicKey"
				children={(field) => <FormTextArea label="Public Key" isRequired field={field} />}
			/>
			<form.Field
				name="alg"
				children={(field) => (
					<FormSelectField label="Alg" isRequired field={field as any}>
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
