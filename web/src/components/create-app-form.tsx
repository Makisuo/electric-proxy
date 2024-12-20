import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { type } from "arktype"
import { IconCheck } from "justd-icons"
import { useListData } from "react-stately"
import { toast } from "sonner"
import { useApi } from "~/lib/api/client"
import { FormTextField } from "./form-components"
import { Button, Form, Heading, Loader, TagField, TextField } from "./ui"

const appSchema = type({
	name: "string > 3",
	clerkSecretKey: "string",
	clerkPublishableKey: "string",
	electricUrl: "string.url",
	publicTables: "string[]",
	tenantColumnKey: "string",
	auth: [
		"null",
		"|",
		{
			type: "'basic' | 'bearer'",
			credentials: "string",
		},
	],
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
					body: value,
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
			auth: null,
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
					onChangeAsync: async ({ value }) => {
						const url = new URL(`${value}/v1/health`)

						const response = await fetch(url)
						if (response.status === 200) {
							const json = await response.json()

							if (json.status === "active") {
								return
							}

							return "Is this a valid Electric Url?"
						}

						if (response.status === 404) {
							return "Not found"
						}

						if (response.status === 401) {
							return "Unauthorized"
						}
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
				name="publicTables"
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
				children={(field) => <FormTextField label="Tenant Column Key" isRequired field={field} />}
			/>
			<Button className={"mb-4"} type="submit">
				Create
			</Button>
		</Form>
	)
}
