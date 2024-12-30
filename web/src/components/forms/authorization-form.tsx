import { type FormApi, useForm } from "@tanstack/react-form"
import { type } from "arktype"
import type { ReactNode } from "react"

import { useQueryClient } from "@tanstack/react-query"
import { useApi } from "~/lib/api/client"
import { Select } from "../ui"
import { Form, FormSelectField, FormTextArea, FormTextField } from "./form-components"

const algs = [{ id: "RS256", name: "RS256" }]

export const authorizationSchema = type({
	publicKey: "string",
	alg: '"RS256"',
})

export interface AuthorizationFormProps {
	id: string
	initialValues?: typeof authorizationSchema.infer

	children: ReactNode
}

export const AuthorizationForm = ({ id, initialValues, children }: AuthorizationFormProps) => {
	const $api = useApi()

	const queryClient = useQueryClient()

	const queryOptions = $api.queryOptions("get", "/app/{id}", { params: { path: { id } } })
	const queryOptionsGetApps = $api.queryOptions("get", "/apps")

	const updateApp = $api.useMutation("put", "/app/{id}", {
		onMutate: async ({ body }) => {
			const previousApp = queryClient.getQueryData(queryOptions.queryKey)
			const previousApps = queryClient.getQueryData(queryOptionsGetApps.queryKey)

			await queryClient.cancelQueries(queryOptions)
			await queryClient.cancelQueries(queryOptionsGetApps)

			queryClient.setQueryData(queryOptions.queryKey, body)
			queryClient.setQueryData(queryOptionsGetApps.queryKey, (old: any[]) =>
				old.map((app) => (app.id === id ? body : app)),
			)

			return { previousApp, previousApps }
		},
		onError: (err, newApp, context: any) => {
			queryClient.setQueryData(queryOptions.queryKey, context.previousApp)
			queryClient.setQueryData(queryOptionsGetApps.queryKey, context.previousApps)
		},
		onSettled: () => {
			queryClient.invalidateQueries(queryOptionsGetApps)
			queryClient.invalidateQueries(queryOptions)
		},
	})

	const form = useForm({
		onSubmit: async () => {
			const app = await updateApp.mutateAsync({
				body: {
					jwt: {
						publicKey: form.getFieldValue("publicKey"),
						alg: form.getFieldValue("alg"),
					},
				},
				params: {
					path: {
						id,
					},
				},
			})
		},
		validators: {
			onChange: authorizationSchema,
		},
		asyncDebounceMs: 400,
		defaultValues: initialValues || {
			alg: "RS256",
			publicKey: "",
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
