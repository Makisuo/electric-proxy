import { useForm } from "@tanstack/react-form"
import { useNavigate } from "@tanstack/react-router"
import { type } from "arktype"
import { IconCheck } from "justd-icons"
import { toast } from "sonner"
import { useApi } from "~/lib/api/client"
import { Form, FormTagField, FormTextField } from "./form-components"
import { Button, Select, TextField } from "./ui"

const appSchema = type({
	name: "string > 3",
	clerkSecretKey: "string",
	clerkPublishableKey: "string",
	electricUrl: "string.url",
	publicTables: "string[]",
	tenantColumnKey: "string",
	"auth?": {
		type: "'basic' | 'bearer'",
		credentials: "string",
	},
})

const getAuthHeader = (auth: (typeof appSchema.infer)["auth"]) => {
	if (!auth) {
		return ""
	}

	if (auth.type === "basic") {
		return `Basic ${btoa(auth.credentials)}`
	}

	return `Bearer ${auth.credentials}`
}

interface SelectAuthProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	auth: (typeof appSchema.infer)["auth"]
	onChange: (auth: (typeof appSchema.infer)["auth"]) => void
}

const SelectAuth = ({ auth, onChange }: SelectAuthProps) => {
	return (
		<div className="flex gap-2">
			<Select
				className="w-max min-w-[120px]"
				selectedKey={auth?.type}
				onSelectionChange={(key) => {
					if (auth) {
						onChange({
							...auth,
							type: key.toString() as "basic" | "bearer",
						})

						return
					}

					onChange({ type: key.toString() as "basic" | "bearer", credentials: "" })
				}}
				placeholder="Auth Type"
				label="Auth Type"
			>
				<Select.Trigger />
				<Select.List
					selectionMode="single"
					items={[
						{
							id: "basic",
							name: "Basic",
						},
						{
							id: "bearer",
							name: "Bearer",
						},
					]}
				>
					{(item) => (
						<Select.Option id={item.id} textValue={item.name}>
							{item.name}
						</Select.Option>
					)}
				</Select.List>
			</Select>
			{auth?.type === "basic" ? (
				<div className="flex w-full gap-2">
					<TextField
						className="w-full"
						label="Username"
						value={auth?.credentials?.split(":")[0] ?? ""}
						onChange={(value) => {
							const password = auth?.credentials?.split(":")[1] ?? ""
							onChange({ ...auth, credentials: `${value}:${password}` })
						}}
						autoComplete="off"
					/>
					<TextField
						className="w-full"
						label="Password"
						type="password"
						value={auth?.credentials?.split(":")[1] ?? ""}
						onChange={(e) => {
							const username = auth?.credentials?.split(":")[0] ?? ""
							onChange({ ...auth, credentials: `${username}:${e}` })
						}}
						isRevealable
						autoComplete="off"
					/>
				</div>
			) : (
				<TextField
					className="w-full"
					label="Bearer Token"
					onChange={(e) => {
						onChange({ type: "bearer", credentials: e })
					}}
					autoComplete="off"
				/>
			)}
		</div>
	)
}

export const CreateAppForm = () => {
	const nav = useNavigate()
	const $api = useApi()

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
						auth: value.auth || null,
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
		<Form form={form} className="flex flex-col gap-6">
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
						const url = new URL(`${value}/v1/health`)

						const auth = form.getFieldValue("auth")

						console.log(auth)

						const authHeader = getAuthHeader(auth)

						console.log(authHeader)

						const response = await fetch(url, {
							headers: {
								Auhorization: authHeader,
							},
						})

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
			<Button className={"mb-4"} type="submit">
				Create
			</Button>
		</Form>
	)
}
