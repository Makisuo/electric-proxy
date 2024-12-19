import { useForm } from "@tanstack/react-form"
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

export const UpdateAppForm = ({ id, initalData }: { id: string; initalData: typeof appSchema.infer }) => {
	const $api = useApi()

	const selectedItems = useListData({
		initialItems: [],
	})

	const updateApp = $api.useMutation("put", "/api/app/{id}", {
		onMutate: (newApp) => {},
	})

	const form = useForm({
		onSubmit: async ({ value }) => {
			console.info("update app")

			toast.promise(
				updateApp.mutateAsync({
					body: {
						...value,
						publicTables: [],
					},
					params: {
						path: {
							id: id,
						},
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
			<Button type="submit">Update</Button>
		</Form>
	)
}