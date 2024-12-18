import { type NavigateOptions, RouterProvider, type ToOptions, createRouter, redirect } from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ClerkProvider, useAuth } from "@clerk/clerk-react"
// Import the generated route tree
import { routeTree } from "./routeTree.gen"

import "./index.css"
import { LoadingScreen } from "./components/loading-screen"

declare module "react-aria-components" {
	interface RouterConfig {
		href: ToOptions["to"]
		params: ToOptions["params"]
		routerOptions: Omit<NavigateOptions, "params">
	}
}

const queryClient = new QueryClient()

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		auth: undefined!,
	},
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

// @ts-expect-error
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key")
}

const InnerApp = () => {
	const auth = useAuth()

	if (!auth.isLoaded) {
		return <LoadingScreen />
	}

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} context={{ auth: auth }} />
		</QueryClientProvider>
	)
}

// Render the app
const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<ClerkProvider
				publishableKey={PUBLISHABLE_KEY}
				routerPush={(to) => redirect({ to })}
				routerReplace={(to) => redirect({ to, replace: true })}
			>
				<InnerApp />
			</ClerkProvider>
		</StrictMode>,
	)
}
