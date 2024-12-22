import { type FieldApi, useForm } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { IconCheck } from "justd-icons"
import { useListData } from "react-stately"
import { toast } from "sonner"
import { useApi } from "~/lib/api/client"
import { appSchema, getAuthHeader } from "./create-app-form"
import { FormTextField } from "./form-components"
import { SelectAuth } from "./select-auth"
import { Button, Form, TagField } from "./ui"

export const UpdateAppForm = ({ id, initalData }: { id: string; initalData: typeof appSchema.infer }) => {
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

	const verifyUrl = $api.useMutation("post", "/electric/v1/verify-url")

	const form = useForm({
		onSubmit: async ({ value }) => {
			toast.promise(
				updateApp.mutateAsync({
					body: value,
					params: {
						path: {
							id: id,
						},
					},
				}),
				{
					loading: "Updating App...",
					success: "Updated App",
					error: (error) => error.message,
				},
			)
		},
		validators: {
			onChange: appSchema,
		},
		defaultValues: initalData,
	})

	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}
			className="flex w-full flex-col gap-2"
		>
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
						isRevealable
						autoComplete="off"
						type="password"
						label="Clerk Secret Key"
						isRequired
						field={field}
					/>
				)}
			/>
			<form.Field
				name="clerkPublishableKey"
				children={(field) => (
					<FormTextField
						isRevealable
						autoComplete="off"
						field={field}
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
			<form.Field name="publicTables" children={(field) => <TagForm field={field} />} />
			<form.Field
				name="tenantColumnKey"
				children={(field) => <FormTextField field={field} label="Tenant Column Key" isRequired />}
			/>
			<Button type="submit">Update</Button>
		</Form>
	)
}

const TagForm = ({ field }: { field: FieldApi<any, any, any, any, string[]> }) => {
	const selectedItems = useListData({
		initialItems: field.state.value.map((value, index) => ({
			id: index,
			name: value,
		})),
	})

	return (
		<TagField
			label="Public Tables"
			name={field.name}
			onItemInserted={(item) => {
				field.pushValue(item.name)
			}}
			onItemCleared={(item) => {
				field.handleChange(field.state.value.filter((i) => i !== item?.name))
			}}
			list={selectedItems}
		/>
	)
}
