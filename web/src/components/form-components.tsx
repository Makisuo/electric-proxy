import type { FieldApi } from "@tanstack/react-form"
import { TextField, type TextFieldProps } from "./ui"

export type FormTextFieldProps = {
	field: FieldApi<any, any, any, any, string>
} & TextFieldProps

export const FormTextField = ({ field, ...props }: FormTextFieldProps) => {
	const isInvalid = field.state.meta.errors.length > 0 && !field.state.meta.isPristine

	return (
		<TextField
			{...props}
			id={field.name}
			name={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={(value) => field.handleChange(value)}
			errorMessage={field.state.meta.isPristine ? undefined : field.state.meta.errors.join(", ")}
			isInvalid={isInvalid}
		/>
	)
}
