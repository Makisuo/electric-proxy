import { type FormApi, useForm } from "@tanstack/react-form"
import { IconCheck, IconX } from "justd-icons"
import { type ReactNode, useEffect } from "react"

import { useApi } from "~/lib/api/client"

import { effectValidator } from "~/lib/validator"
import { SelectAuth } from "../select-auth"
import { Form, FormTagField, FormTextField } from "./form-components"

import { App } from "shared/models/app"
import { Separator } from "../ui"

export type InserAppData = typeof App.jsonCreate.Type
export type JSONApp = typeof App.json.Type

export interface AppFormProps {
	onSubmit: (app: {
		value: InserAppData
		formApi: FormApi<InserAppData, any>
	}) => Promise<void>
	initialValues?: typeof App.json.Type

	children: ReactNode
}

export const AppForm = ({ onSubmit, initialValues, children }: AppFormProps) => {
	const $api = useApi()

	const verifyUrl = $api.useMutation("post", "/electric/v1/verify-url")
	const verifyClerkSecretKey = $api.useMutation("post", "/auth/verify-token")

	const form = useForm({
		validatorAdapter: effectValidator(),
		validators: {
			onChange: { schema: App.jsonCreate },
		},
		onSubmit: onSubmit,
		asyncDebounceMs: 400,
		defaultValues:
			(initialValues as InserAppData) ||
			({
				name: "",
				electricUrl: "",
				tenantColumnKey: "",
				publicTables: [],
				auth: null,
				clerkSecretKey: null,
			} satisfies InserAppData),
	})

	useEffect(() => {
		form.reset(initialValues)
	}, [initialValues, form.reset])

	return (
		<Form form={form} className="flex w-full flex-col gap-6">
			<form.Field name="name" children={(field) => <FormTextField label="Name" isRequired field={field} />} />
			{/* <form.Field
				name="clerkSecretKey"
				asyncDebounceMs={400}
				validators={{
					onChangeAsync: async ({ value }) => {
						if (!value) {
							return
						}
						const data = await verifyClerkSecretKey.mutateAsync({
							body: {
								type: "clerk",
								credentials: value,
							},
						})

						if (data.valid) {
							return
						}

						return "Clerk Secret Key is invalid"
					},
				}}
				children={(field) => {
					const isSuccess =
						!field.state.meta.isValidating && field.state.value && field.state.meta.errors.length === 0
					const isError = field.state.meta.errors.length > 0
					return (
						<FormTextField
							field={field}
							isRevealable
							autoComplete="off"
							type="password"
							label="Clerk Secret Key (Optional)"
							isPending={field.state.meta.isValidating}
							prefix={
								isSuccess ? (
									<IconCheck className="text-success" />
								) : isError ? (
									<IconX className="text-danger" />
								) : (
									field.state.meta.isValidating && <Loader variant="spin" data-slot="prefix" />
								)
							}
							isRequired
						/>
					)
				}}
			/> */}

			<form.Field
				name="auth"
				children={(field) => (
					<SelectAuth
						auth={field.state.value}
						onChange={(auth) => {
							if (auth?.type === "electric-cloud") {
								form.setFieldValue("electricUrl", "https://api.electric-sql.cloud")
							}
							field.setValue(auth)
						}}
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

						if (!auth) {
							return
						}

						const data = await verifyUrl.mutateAsync({
							body: { url: value, auth },
						})

						if (data.valid) {
							return
						}

						return "Not Valid"
					},
				}}
				children={(field) => {
					const isSuccess =
						!field.state.meta.isValidating && field.state.value && field.state.meta.errors.length === 0
					const isError = field.state.meta.errors.length > 0

					return (
						<form.Subscribe selector={(form) => form.values.auth}>
							{(auth) => (
								<FormTextField
									label="Electric Url"
									field={field}
									isRequired
									isDisabled={auth?.type === "electric-cloud"}
									type="url"
									isPending={field.state.meta.isValidating}
									suffix={
										isSuccess ? (
											<IconCheck className="text-success" />
										) : (
											isError && <IconX className="text-danger" />
										)
									}
								/>
							)}
						</form.Subscribe>
					)
				}}
			/>

			<form.Field
				name="publicTables"
				children={(field) => <FormTagField field={field} label="Public Tables (Optional)" name={field.name} />}
			/>
			<form.Field
				name="tenantColumnKey"
				children={(field) => <FormTextField label="Tenant Column Key" isRequired field={field} />}
			/>
			{children}
		</Form>
	)
}
