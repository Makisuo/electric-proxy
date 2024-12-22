import { type FormApi, useForm } from "@tanstack/react-form"
import { type } from "arktype"
import { IconCheck } from "justd-icons"
import type { ReactNode } from "react"

import { useApi } from "~/lib/api/client"

import { Form, FormTagField, FormTextField } from "./form-components"
import { SelectAuth } from "./select-auth"

export const getAuthHeader = (auth: (typeof appSchema.infer)["auth"]) => {
	if (!auth) {
		return ""
	}

	if (auth.type === "basic" && auth.credentials) {
		return `Basic ${btoa(auth.credentials)}`
	}

	return `Bearer ${auth.credentials}`
}

export const appSchema = type({
	name: "string >= 3",
	clerkSecretKey: "string",
	clerkPublishableKey: "string",
	electricUrl: "string.url",
	publicTables: "string[]",
	tenantColumnKey: "string",
	auth: {
		type: ["'basic' | 'bearer'", "|", "null"],
		credentials: ["string", "|", "null"],
	},
})

export interface AppFormProps {
	onSubmit: (app: { value: typeof appSchema.infer; formApi: FormApi<typeof appSchema.infer> }) => Promise<void>
	initialValues?: typeof appSchema.infer

	children: ReactNode
}

export const AppForm = ({ onSubmit, initialValues, children }: AppFormProps) => {
	const $api = useApi()

	const verifyUrl = $api.useMutation("post", "/electric/v1/verify-url")

	const form = useForm({
		onSubmit: onSubmit,
		validators: {
			onChange: appSchema,
		},
		defaultValues: initialValues || {
			name: "",
			clerkSecretKey: "",
			clerkPublishableKey: "",
			electricUrl: "",
			tenantColumnKey: "",
			publicTables: [],
			auth: {
				type: null,
				credentials: null,
			},
		},
	})

	return (
		<Form form={form} className="flex w-full flex-col gap-6">
			<form.Field name="name" children={(field) => <FormTextField label="Name" isRequired field={field} />} />
			<form.Field
				name="clerkSecretKey"
				validators={{
					onSubmit: ({ value }) => {
						if (!value || value.length === 0) {
							return "Clerk Secret Key is required"
						}
					},
				}}
				children={(field) => (
					<FormTextField
						field={field}
						isRevealable
						autoComplete="off"
						type="password"
						label="Clerk Secret Key"
						isRequired
					/>
				)}
			/>
			<form.Field
				name="clerkPublishableKey"
				children={(field) => (
					<FormTextField
						field={field}
						isRevealable
						autoComplete="off"
						type="password"
						label="Clerk Publishable Key"
						isRequired
					/>
				)}
			/>
			<form.Field
				name="electricUrl"
				asyncDebounceMs={400}
				validators={{
					onChangeListenTo: ["auth"],
					onChangeAsync: async ({ value }) => {
						const auth = form.getFieldValue("auth")

						const authHeader = getAuthHeader(auth)

						const data = await verifyUrl.mutateAsync({
							body: { url: value },
							params: {
								header: {
									electric_auth: authHeader,
								},
							},
						})

						if (data.valid) {
							return
						}

						return "Not Valid"
					},
				}}
				children={(field) => {
					return (
						<FormTextField
							label="Electric Url"
							field={field}
							isRequired
							type="url"
							isPending={field.state.meta.isValidating}
							suffix={
								!field.state.meta.isValidating &&
								field.state.value &&
								field.state.meta.errors.length === 0 && <IconCheck className="text-success" />
							}
						/>
					)
				}}
			/>

			<form.Field
				name="auth"
				children={(field) => <SelectAuth auth={field.state.value} onChange={(auth) => field.setValue(auth)} />}
			/>

			<form.Field
				name="publicTables"
				children={(field) => <FormTagField field={field} label="Public Tables" name={field.name} />}
			/>
			<form.Field
				name="tenantColumnKey"
				children={(field) => <FormTextField label="Tenant Column Key" isRequired field={field} />}
			/>
			{children}
		</Form>
	)
}
