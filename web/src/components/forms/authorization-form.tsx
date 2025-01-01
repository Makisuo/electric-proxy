import { useForm } from "@tanstack/react-form"
import { type ReactNode, useEffect, useState } from "react"

import { IconBrandClerk, IconGlobe2, IconKeyhole } from "justd-icons"
import { Jwt } from "shared/models/jwt"
import { effectValidator } from "~/lib/validator"
import { Select, Tabs } from "../ui"
import { Form, FormSelectField, FormTextArea, FormTextField } from "./form-components"

const algs = [
	{ id: "RS256", name: "RS256" },
	{ id: "PS256", name: "PS256" },
	{ id: "EdDSA", name: "EdDSA" },
	{ id: "ES256", name: "ES256" },
]

export type InsertJwtData = typeof Jwt.jsonCreate.Type

export type JWTProvider = NonNullable<(typeof Jwt.jsonCreate.Type)["provider"]>

export const providers = {
	clerk: {
		icon: IconBrandClerk,
		label: "Clerk",
	},
	custom: {
		icon: IconKeyhole,
		label: "Custom",
	},
	"custom-remote": {
		icon: IconGlobe2,
		label: "Custom Remote",
	},
} as const satisfies Record<JWTProvider, { icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string }>

const defaultValues: InsertJwtData = {
	alg: "RS256",
	provider: "custom",
	publicKey: null,
	publicKeyRemote: null,
}

export interface AuthorizationFormProps {
	onSubmit: (value: InsertJwtData) => Promise<void>
	initialValues?: InsertJwtData
	children: ReactNode
}

export const AuthorizationForm = ({ onSubmit, initialValues, children }: AuthorizationFormProps) => {
	const [tab, setTab] = useState(initialValues?.provider || "clerk")

	return (
		<div className="w-full">
			<Tabs
				selectedKey={tab}
				onSelectionChange={(key) => setTab(key.toString() as "clerk")}
				aria-label="Authorization Type"
			>
				<Tabs.List>
					<Tabs.Tab id="clerk">
						<IconBrandClerk />
						Clerk
					</Tabs.Tab>
					<Tabs.Tab id="custom">
						<IconKeyhole />
						Public Key
					</Tabs.Tab>
					<Tabs.Tab id="custom-remote">
						<IconGlobe2 />
						Remote JWKS
					</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel id="clerk">
					<ClerkAuthForm onSubmit={onSubmit} initialValues={initialValues}>
						{children}
					</ClerkAuthForm>
				</Tabs.Panel>
				<Tabs.Panel id="custom">
					<CustomAuthForm onSubmit={onSubmit} initialValues={initialValues}>
						{children}
					</CustomAuthForm>
				</Tabs.Panel>
				<Tabs.Panel id="custom-remote">
					<CustomRemoteAuthForm onSubmit={onSubmit} initialValues={initialValues}>
						{children}
					</CustomRemoteAuthForm>
				</Tabs.Panel>
			</Tabs>
		</div>
	)
}

const CustomAuthForm = ({
	onSubmit,
	initialValues,
	children,
}: {
	onSubmit: (value: InsertJwtData) => Promise<void>
	initialValues?: InsertJwtData

	children: ReactNode
}) => {
	const form = useForm({
		onSubmit: ({ value }) => onSubmit({ ...value, provider: "custom" }),
		validatorAdapter: effectValidator(),
		validators: {
			onChange: {
				schema: Jwt.jsonCreate,
			},
		},
		asyncDebounceMs: 400,
		defaultValues: initialValues || defaultValues,
	})

	useEffect(() => {
		form.reset(initialValues || defaultValues)
	}, [initialValues, form.reset])

	return (
		<Form form={form} className="flex w-full flex-col gap-6">
			<form.Field
				name="publicKey"
				children={(field) => <FormTextArea label="Public Key" isRequired field={field} />}
			/>
			<form.Field
				name="alg"
				children={(field) => (
					// @ts-expect-error
					<FormSelectField label="Alg" isRequired field={field}>
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

const CustomRemoteAuthForm = ({
	onSubmit,
	initialValues,
	children,
}: {
	onSubmit: (value: InsertJwtData) => Promise<void>
	initialValues?: InsertJwtData

	children: ReactNode
}) => {
	const form = useForm({
		onSubmit: ({ value }) => onSubmit({ ...value, provider: "custom-remote", alg: null }),
		validatorAdapter: effectValidator(),
		validators: {
			onChange: {
				schema: Jwt.jsonCreate,
			},
		},
		asyncDebounceMs: 400,
		defaultValues: initialValues || defaultValues,
	})

	useEffect(() => {
		form.reset(initialValues || defaultValues)
	}, [initialValues, form.reset])

	return (
		<Form form={form} className="flex w-full flex-col gap-6">
			<form.Field
				name="publicKeyRemote"
				children={(field) => <FormTextField type="url" label="Remote Key" isRequired field={field} />}
			/>

			{children}
		</Form>
	)
}

const ClerkAuthForm = ({
	onSubmit,
	initialValues,
	children,
}: {
	onSubmit: (value: InsertJwtData) => Promise<void>
	initialValues?: InsertJwtData

	children: ReactNode
}) => {
	const form = useForm({
		onSubmit: ({ value }) =>
			onSubmit({
				...value,
				alg: "RS256",
				publicKeyRemote: null,
				provider: "clerk",
			}),
		validatorAdapter: effectValidator(),
		validators: {
			onChange: { schema: Jwt.jsonCreate.omit("alg") },
		},
		asyncDebounceMs: 400,
		defaultValues: initialValues || defaultValues,
	})

	useEffect(() => {
		form.reset(initialValues || defaultValues)
	}, [initialValues, form.reset])

	return (
		<Form form={form} className="flex w-full flex-col gap-6">
			<form.Field
				name="publicKey"
				children={(field) => <FormTextArea label="Public Key" isRequired field={field} />}
			/>

			{children}
		</Form>
	)
}
