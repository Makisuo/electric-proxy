import type { JSONApp } from "./forms/app-form"
import { Select, TextField } from "./ui"

export interface SelectAuthProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	auth: JSONApp["auth"]
	onChange: (auth: JSONApp["auth"]) => void
}

export const SelectAuth = ({ auth, onChange }: SelectAuthProps) => {
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
