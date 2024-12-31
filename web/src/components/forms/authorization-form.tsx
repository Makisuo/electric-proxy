import { useForm } from "@tanstack/react-form"
import { type } from "arktype"
import { type ReactNode, useEffect, useState } from "react"

import { IconAdjustment, IconCirclePlaceholderDashed } from "justd-icons"
import { Select, Tabs } from "../ui"
import { Form, FormSelectField, FormTextArea } from "./form-components"

const algs = [
	{ id: "RS256", name: "RS256" },
	{ id: "PS256", name: "PS256" },
	{ id: "EdDSA", name: "EdDSA" },
	{ id: "ES256", name: "ES256" },
]

export const authorizationSchema = type({
	publicKey: "string",
	alg: "string",
})

export interface AuthorizationFormProps {
	onSubmit: (provider: "clerk" | "custom", value: typeof authorizationSchema.infer) => Promise<void>
	initialValues?: typeof authorizationSchema.infer

	children: ReactNode
}

export const AuthorizationForm = ({ onSubmit, initialValues, children }: AuthorizationFormProps) => {
	const [tab, setTab] = useState("clerk")

	return (
		<div className="w-full">
			<Tabs selectedKey={tab} onSelectionChange={(key) => setTab(key.toString())} aria-label="Authorization Type">
				<Tabs.List>
					<Tabs.Tab id="clerk">
						<IconCirclePlaceholderDashed />
						Clerk
					</Tabs.Tab>
					<Tabs.Tab id="custom">
						<IconAdjustment />
						Custom Public Key
					</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel id="clerk">
					<ClerkAuthForm onSubmit={(v) => onSubmit("clerk", v)} initialValues={initialValues}>
						{children}
					</ClerkAuthForm>
				</Tabs.Panel>
				<Tabs.Panel id="custom">
					<CustomAuthForm onSubmit={(v) => onSubmit("custom", v)} initialValues={initialValues}>
						{children}
					</CustomAuthForm>
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
	onSubmit: (value: typeof authorizationSchema.infer) => Promise<void>
	initialValues?: typeof authorizationSchema.infer

	children: ReactNode
}) => {
	const form = useForm({
		onSubmit: ({ value }) => onSubmit(value),
		validators: {
			onChange: authorizationSchema,
		},
		asyncDebounceMs: 400,
		defaultValues: initialValues || {
			alg: "RS256",
			publicKey: undefined!,
		},
	})

	useEffect(() => {
		form.reset(
			initialValues || {
				alg: "RS256",
				publicKey: undefined!,
			},
		)
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

const ClerkAuthForm = ({
	onSubmit,
	initialValues,
	children,
}: {
	onSubmit: (value: typeof authorizationSchema.infer) => Promise<void>
	initialValues?: typeof authorizationSchema.infer

	children: ReactNode
}) => {
	const form = useForm({
		onSubmit: ({ value }) => onSubmit({ ...value, alg: "RS256" }),
		validators: {
			// @ts-expect-error
			onChange: authorizationSchema.omit("alg"),
		},
		asyncDebounceMs: 400,
		defaultValues: initialValues || {
			publicKey: undefined!,
		},
	})

	useEffect(() => {
		form.reset(
			initialValues || {
				publicKey: undefined!,
			},
		)
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
