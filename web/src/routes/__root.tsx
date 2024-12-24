import { Outlet, createRootRouteWithContext, useRouter } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"

import { RouterProvider as AriaRouterProvider } from "react-aria-components"
import { ThemeProvider } from "~/components/theme-provider"
import { Toast } from "~/components/ui/toast"

import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type { useSession } from "~/lib/auth"

interface RootRouteContext {
	auth: ReturnType<typeof useSession>["data"]
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
	component: () => {
		const router = useRouter()
		return (
			<AriaRouterProvider
				navigate={(to, options) => router.navigate({ to, ...options })}
				useHref={(to) => router.buildLocation({ to: to }).href}
			>
				<ThemeProvider>
					<Toast />
					<Outlet />
					{import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
					<ReactQueryDevtools buttonPosition="top-right" />
				</ThemeProvider>
			</AriaRouterProvider>
		)
	},
})
