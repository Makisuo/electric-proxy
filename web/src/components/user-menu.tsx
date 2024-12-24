import { useNavigate, useRouteContext } from "@tanstack/react-router"
import {
	IconChevronLgDown,
	IconCommandRegular,
	IconDashboard,
	IconDeviceDesktop,
	IconHeadphones,
	IconLogout,
	IconMoon,
	IconSettings,
	IconSun,
} from "justd-icons"

import { Avatar, Button, Menu } from "ui"
import { signOut } from "~/lib/auth"
import { useTheme } from "./theme-provider"

interface UserMenuProps {
	compact?: boolean
}

export const UserMenu = ({ compact = false }: UserMenuProps) => {
	const navigate = useNavigate()

	const { auth } = useRouteContext({ from: "/_app" })

	const { theme, setTheme } = useTheme()

	return (
		<Menu>
			{compact ? (
				<Button appearance="plain" size="square-petite" shape="circle" aria-label="Profile" className="group">
					<Avatar size="small" initials={auth?.user.name?.split(" ")[0]?.charAt(0)} src={auth?.user.image} />
				</Button>
			) : (
				<Button appearance="plain" aria-label="Profile" className="group flex w-full justify-start">
					<Avatar
						size="small"
						shape="square"
						className="-ml-1.5"
						initials={auth?.user.name?.split(" ")[0]?.charAt(0)}
						src={auth?.user.image}
					/>
					{auth?.user.name}
					<IconChevronLgDown className="absolute right-3 transition-transform group-pressed:rotate-180" />
				</Button>
			)}

			<Menu.Content placement="top" className="min-w-(--trigger-width)">
				<Menu.Item href="/">
					<IconDashboard className="size-4" />
					Dashboard
				</Menu.Item>
				<Menu.Item href="/">
					<IconSettings className="size-4" />
					Settings
				</Menu.Item>

				<Menu.Separator />
				<Menu.Item>
					<IconCommandRegular className="size-4" />
					Command Menu
				</Menu.Item>
				<Menu.Submenu>
					<Menu.Item>
						{theme === "light" ? (
							<IconSun className="size-4" />
						) : theme === "dark" ? (
							<IconMoon className="size-4" />
						) : (
							<IconDeviceDesktop className="size-4" />
						)}
						Switch theme
					</Menu.Item>
					<Menu.Content>
						<Menu.Item onAction={() => setTheme("system")}>
							<IconDeviceDesktop className="size-4" /> System
						</Menu.Item>
						<Menu.Item onAction={() => setTheme("dark")}>
							<IconMoon className="size-4" /> Dark
						</Menu.Item>
						<Menu.Item onAction={() => setTheme("light")}>
							<IconSun className="size-4" /> Light
						</Menu.Item>
					</Menu.Content>
				</Menu.Submenu>
				<Menu.Separator />
				<Menu.Item href="/">
					<IconHeadphones className="size-4" />
					Contact Support
				</Menu.Item>
				<Menu.Separator />
				<Menu.Item
					onAction={async () => {
						await signOut({
							fetchOptions: {
								onSuccess: () => {
									throw navigate({ to: "/auth/signin" })
								},
							},
						})
					}}
				>
					<IconLogout className="size-4" />
					Log out
				</Menu.Item>
			</Menu.Content>
		</Menu>
	)
}
