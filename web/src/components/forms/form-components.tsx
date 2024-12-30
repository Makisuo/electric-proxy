import type { FieldApi, ReactFormExtendedApi } from "@tanstack/react-form"
import { type ReactNode, useEffect, useState } from "react"
import { useListData } from "react-stately"
import {
	Select,
	type SelectProps,
	TagField,
	type TagFieldProps,
	TextField,
	type TextFieldProps,
	Textarea,
	type TextareaProps,
} from "../ui"

import type { FormProps } from "react-aria-components"
import { Form as RacForm } from "react-aria-components"

export const Form = ({
	form,
	children,
	...props
}: { form: ReactFormExtendedApi<any, any>; children: ReactNode } & FormProps) => {
	return (
		<RacForm
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}
			{...props}
		>
			{children}
		</RacForm>
	)
}

export type FormTextFieldProps = {
	field: FieldApi<any, any, any, any, string>
} & TextFieldProps

export const FormTextField = ({ field, ...props }: FormTextFieldProps) => {
	const { errorMessage, isInvalid } = useFieldState(field)

	return (
		<TextField
			{...props}
			id={field.name}
			name={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={(value) => field.handleChange(value)}
			errorMessage={errorMessage}
			isInvalid={isInvalid}
		/>
	)
}

export type FormTextAreaProps = {
	field: FieldApi<any, any, any, any, string>
} & TextareaProps

export const FormTextArea = ({ field, ...props }: FormTextAreaProps) => {
	const { errorMessage, isInvalid } = useFieldState(field)

	return (
		<Textarea
			{...props}
			id={field.name}
			name={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={(value) => field.handleChange(value)}
			errorMessage={errorMessage}
			isInvalid={isInvalid}
		/>
	)
}

export type FormTagFieldProps = {
	field: FieldApi<any, any, any, any, string[]>
} & Omit<TagFieldProps, "list">

export const FormTagField = ({ field, ...props }: FormTagFieldProps) => {
	const { errorMessage } = useFieldState(field)

	const selectedItems = useListData({
		initialItems: field.state.value.map((value, index) => ({
			id: index,
			name: value,
		})),
	})

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		selectedItems.remove(...selectedItems.items.map((item) => item.id))
		selectedItems.append(
			...field.state.value.map((value, index) => ({
				id: index,
				name: value,
			})),
		)
	}, [field.state.value])

	return (
		<TagField
			name={field.name}
			onItemInserted={(item) => {
				field.pushValue(item.name)
			}}
			onItemCleared={(item) => {
				field.handleChange(field.state.value.filter((i) => i !== item?.name))
			}}
			{...props}
			list={selectedItems}
			errorMessage={errorMessage}
		/>
	)
}

export type FormSelectFieldProps<T extends object> = {
	field: FieldApi<any, any, any, any, string>
} & SelectProps<T>

export const FormSelectField = <T extends object>({ field, children, ...props }: FormSelectFieldProps<T>) => {
	const { errorMessage, isInvalid } = useFieldState(field)

	return (
		<Select errorMessage={errorMessage} isInvalid={isInvalid} {...props}>
			{children}
		</Select>
	)
}

const useFieldState = (field: FieldApi<any, any, any, any, any>) => {
	const isInvalid = field.state.meta.errors.length > 0 && (!field.state.meta.isPristine || !!field.state.value)
	const errorMessage = !isInvalid ? undefined : field.state.meta.errors.join(", ")

	return { isInvalid, errorMessage }
}
