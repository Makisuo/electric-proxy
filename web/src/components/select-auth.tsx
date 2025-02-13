import { cn } from "~/utils/classes"
import type { JSONApp } from "./forms/app-form"
import { Select, TextField } from "./ui"

export interface SelectAuthProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	auth: JSONApp["auth"]
	onChange: (auth: JSONApp["auth"]) => void
}

export const SelectAuth = ({ auth, onChange }: SelectAuthProps) => {
	return (
		<div className={cn("flex flex-col gap-2", auth?.type === "bearer" ? "flex-row" : "flex-col")}>
			<Select
				className="w-max min-w-[120px]"
				selectedKey={auth?.type}
				onSelectionChange={(key) => {
					if (auth) {
						onChange({
							...auth,
							type: key.toString() as any,
						})

						return
					}

					onChange({ type: key.toString() as any } as any)
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
						{
							id: "electric-cloud",
							name: "Electric Cloud",
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
			{auth?.type === "basic" && (
				<div className="flex w-full gap-2">
					<TextField
						className="w-full"
						label="Username"
						value={auth?.username}
						onChange={(value) => {
							const password = auth?.password
							onChange({ ...auth, username: value, password })
						}}
						autoComplete="off"
					/>
					<TextField
						className="w-full"
						label="Password"
						type="password"
						value={auth?.password}
						onChange={(password) => {
							const username = auth?.username
							onChange({ ...auth, username, password })
						}}
						isRevealable
						autoComplete="off"
					/>
				</div>
			)}
			{auth?.type === "bearer" && (
				<TextField
					className="w-full"
					label="Bearer Token"
					onChange={(val) => {
						onChange({ type: "bearer", credentials: val })
					}}
					autoComplete="off"
				/>
			)}
			{auth?.type === "electric-cloud" && (
				<div className={"flex w-full gap-2"}>
					<TextField
						className="w-full"
						label="Source Id"
						value={auth?.sourceId?.split(":")[0] ?? ""}
						onChange={(value) => {
							onChange({ ...auth, sourceId: value, sourceSecret: auth.sourceSecret })
						}}
						autoComplete="off"
					/>
					<TextField
						className="w-full"
						label="Source Secret"
						type="password"
						value={auth?.sourceSecret}
						onChange={(val) => {
							onChange({ ...auth, sourceSecret: val, sourceId: auth.sourceId })
						}}
						isRevealable
						autoComplete="off"
					/>
				</div>
			)}
		</div>
	)
}
