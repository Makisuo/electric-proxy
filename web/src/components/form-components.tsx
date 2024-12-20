import type { FieldApi, ReactFormExtendedApi } from "@tanstack/react-form"
import type { ReactNode } from "react"
import { useListData } from "react-stately"
import { TagField, type TagFieldProps, TextField, type TextFieldProps } from "./ui"

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

export type FormTagFieldProps = {
	field: FieldApi<any, any, any, any, string[]>
} & Omit<TagFieldProps, "list">

export const FormTagField = ({ field, ...props }: FormTagFieldProps) => {
	const { errorMessage, isInvalid } = useFieldState(field)

	const selectedItems = useListData({
		initialItems: field.state.value.map((value, index) => ({
			id: index,
			name: value,
		})),
	})

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

const useFieldState = (field: FieldApi<any, any, any, any, any>) => {
	const isInvalid = field.state.meta.errors.length > 0 && !field.state.meta.isPristine
	const errorMessage = field.state.meta.isPristine ? undefined : field.state.meta.errors.join(", ")

	return { isInvalid, errorMessage }
}
