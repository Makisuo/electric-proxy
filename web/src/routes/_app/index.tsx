import { createFileRoute } from "@tanstack/react-router"
import { toast } from "sonner"
import { Button, Form, Heading, TagField, TextField } from "~/components/ui"
import { useApi } from "~/lib/api/client"

import { useForm } from "@tanstack/react-form"

import { useListData } from "react-stately"

import { type } from "arktype"

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
})

const appSchema = type({
	name: "string > 3",
	clerkSecretKey: "string",
	clerkPublishableKey: "string",
	electricUrl: "string.url",
	publicTables: "string[]",
	tenantColumnKey: "string",
})

function RouteComponent() {
	const $api = useApi()

	const createApp = $api.useMutation("post", "/api/app")

	const selectedItems = useListData({
		initialItems: [],
	})

	const form = useForm({
		onSubmit: async ({ value }) => {
			console.info("create app")

			toast.promise(
				createApp.mutateAsync({
					body: {
						...value,
					},
				}),
				{
					loading: "Creating App...",
					success: "Created App",
					error: (error) => error.message,
				},
			)
		},
		validators: {
			onChange: appSchema,
		},
		defaultValues: {
			name: "",
			clerkSecretKey: "",
			clerkPublishableKey: "",
			electricUrl: "",
			publicTables: [],
			tenantColumnKey: "",
		},
	})

	return (
		<div className="space-y-4">
			<Heading level={2}>Create new App</Heading>
			<Form
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}
				className="flex flex-col gap-2"
			>
				<form.Field
					name="name"
					validators={{
						onSubmit: ({ value }) => {
							if (!value || value.length === 0) {
								return "Name is required"
							}
						},
					}}
					// biome-ignore lint/correctness/noChildrenProp: <explanation>
					children={(field) => (
						<TextField
							label="Name"
							isRequired
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(value) => field.handleChange(value)}
							errorMessage={field.state.meta.errors.join(", ")}
							isInvalid={field.state.meta.errors.length > 0}
						/>
					)}
				/>
				<form.Field
					name="clerkSecretKey"
					validators={{
						onSubmit: ({ value }) => {
							if (!value || value.length === 0) {
								return "Clerk Secret Key is required"
							}
						},
					}}
					// biome-ignore lint/correctness/noChildrenProp: <explanation>
					children={(field) => (
						<TextField
							label="Clerk Secret Key"
							isRequired
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(value) => field.handleChange(value)}
							errorMessage={field.state.meta.errors.join(", ")}
							isInvalid={field.state.meta.errors.length > 0}
						/>
					)}
				/>
				<form.Field
					name="clerkPublishableKey"
					validators={{
						onSubmit: ({ value }) => {
							if (!value || value.length === 0) {
								return "Clerk Publishable Key is required"
							}
						},
					}}
					// biome-ignore lint/correctness/noChildrenProp: <explanation>
					children={(field) => (
						<TextField
							label="Clerk Publishable Key"
							isRequired
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(value) => field.handleChange(value)}
							errorMessage={field.state.meta.errors.join(", ")}
							isInvalid={field.state.meta.errors.length > 0}
						/>
					)}
				/>
				<form.Field
					name="electricUrl"
					validators={{
						onSubmit: ({ value }) => {
							if (!value || value.length === 0) {
								return "Electric Url is required"
							}
						},
					}}
					// biome-ignore lint/correctness/noChildrenProp: <explanation>
					children={(field) => (
						<TextField
							label="Electric Url"
							isRequired
							id={field.name}
							name={field.name}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(value) => field.handleChange(value)}
							errorMessage={field.state.meta.errors.join(", ")}
							isInvalid={field.state.meta.errors.length > 0}
						/>
					)}
				/>
				<form.Field
					name="publicTables"
					validators={{
						onSubmit: ({ value }) => {
							if (!value || value.length === 0) {
								return "Public Tables is required"
							}
						},
					}}
					// biome-ignore lint/correctness/noChildrenProp: <explanation>
					children={(field) => (
						<TagField
							label="Public Tables"
							name={field.name}
							onItemInserted={(item) => {
								field.handleChange([...field.state.value, item.name])
							}}
							onItemCleared={(item) => {
								field.handleChange(field.state.value.filter((i) => i !== item?.name))
							}}
							list={selectedItems}
							className="mb-2"
						/>
					)}
				/>
				<form.Field
					name="tenantColumnKey"
					validators={{
						onSubmit: ({ value }) => {
							if (!value || value.length === 0) {
								return "Tenant Column Key is required"
							}
						},
					}}
					// biome-ignore lint/correctness/noChildrenProp: <explanation>
					children={(field) => (
						<TextField
							label="Tenant Column Key"
							isRequired
							id={field.name}
							name={field.name.replace("publicTables", "tenantColumnKey")}
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(value) => field.handleChange(value)}
							errorMessage={field.state.meta.errors.join(", ")}
							isInvalid={field.state.meta.errors.length > 0}
						/>
					)}
				/>
				<Button type="submit">Submit</Button>
			</Form>
		</div>
	)
}
