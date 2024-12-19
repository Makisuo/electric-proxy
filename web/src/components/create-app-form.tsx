import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { type } from "arktype"
import { useListData } from "react-stately"
import { toast } from "sonner"
import { useApi } from "~/lib/api/client"
import { Button, Form, Heading, TagField, TextField } from "./ui"

const appSchema = type({
	name: "string > 3",
	clerkSecretKey: "string",
	clerkPublishableKey: "string",
	electricUrl: "string.url",
	publicTables: "string[]",
	tenantColumnKey: "string",
})

export const CreateAppForm = () => {
	const nav = useNavigate()
	const $api = useApi()

	const selectedItems = useListData({
		initialItems: [],
	})

	const createApp = $api.useMutation("post", "/api/app", {
		onSuccess: (app) => {
			nav({ to: "/$id", params: { id: app.id } })
		},
	})

	const form = useForm({
		onSubmit: async ({ value }) => {
			console.info("create app")

			toast.promise(
				createApp.mutateAsync({
					body: {
						...value,
						publicTables: [],
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
			tenantColumnKey: "",
			publicTables: [],
		},
	})

	return (
		<Form
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}
			className="flex flex-col gap-6"
		>
			<form.Field
				name="name"
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
						isRevealable
						autoComplete="off"
						type="password"
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
				// biome-ignore lint/correctness/noChildrenProp: <explanation>
				children={(field) => (
					<TextField
						isRevealable
						autoComplete="off"
						type="password"
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
				// biome-ignore lint/correctness/noChildrenProp: <explanation>
				children={(field) => {
					return (
						<TextField
							label="Electric Url"
							isRequired
							id={field.name}
							name={field.name}
							type="url"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={(value) => field.handleChange(value)}
							errorMessage={field.state.meta.errors.join(", ")}
							isInvalid={field.state.meta.errors.length > 0}
						/>
					)
				}}
			/>
			<form.Field
				name="publicTables"
				// biome-ignore lint/correctness/noChildrenProp: <explanation>
				children={(field) => (
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
				)}
			/>
			<form.Field
				name="tenantColumnKey"
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
			<Button className={"mb-4"} type="submit">
				Create
			</Button>
		</Form>
	)
}
