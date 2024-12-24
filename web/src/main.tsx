import { type NavigateOptions, RouterProvider, type ToOptions, createRouter } from "@tanstack/react-router"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { routeTree } from "./routeTree.gen"

import "./index.css"

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
		queryClient,
	},
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key")
}

const InnerApp = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}

// Render the app
const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<InnerApp />
		</StrictMode>,
	)
}
