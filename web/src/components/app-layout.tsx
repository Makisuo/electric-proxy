"use client"

import type React from "react"

import { IconCreditCard, IconDashboard, IconPlus, IconSettings } from "justd-icons"

import { Button, Container, Link } from "ui"
import { Logo } from "./logo"

import { useLocation } from "@tanstack/react-router"
import type { ComponentProps } from "react"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarItem,
	SidebarProvider,
	SidebarRail,
	SidebarSection,
	SidebarTrigger,
	useSidebar,
} from "./ui/sidebar"
import { UserMenu } from "./user-menu"

export function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<InnerAppLayout>{children}</InnerAppLayout>
		</SidebarProvider>
	)
}

const InnerAppLayout = ({ children }: { children: React.ReactNode }) => {
	const { state } = useSidebar()
	const collapsed = state === "collapsed"

	return (
		<>
			<Sidebar collapsible="dock">
				<SidebarHeader>
					<Link className="flex items-center gap-x-2" href="/">
						<Logo className="h-6 w-min" withText={!collapsed} />
					</Link>
				</SidebarHeader>
				<SidebarContent>
					<SidebarSection>
						<NavItem href="/">
							<IconDashboard />
							Dashboard
						</NavItem>
					</SidebarSection>
				</SidebarContent>
				<SidebarFooter>
					<UserMenu compact={collapsed} />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<header className="sticky top-0 flex h-[3.57rem] items-center justify-between gap-x-2 border-b bg-bg px-4 sm:justify-start">
					<span className="flex items-center gap-x-3">
						<SidebarTrigger className="-mx-2" />
					</span>
				</header>
				<Container className="py-6">{children}</Container>
			</SidebarInset>
		</>
	)
}

function useIsCurrentRoute(path: string): boolean {
	const location = useLocation()

	// Normalize paths by removing trailing slashes
	const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path
	const normalizedPathname = location.pathname.endsWith("/") ? location.pathname.slice(0, -1) : location.pathname

	return normalizedPathname === normalizedPath
}

export const NavItem = ({ href, ...rest }: ComponentProps<typeof SidebarItem>) => {
	const isMatch = useIsCurrentRoute(href || "x.x")
	return <SidebarItem isCurrent={isMatch} href={href} {...rest} />
}
