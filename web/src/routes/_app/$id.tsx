import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { type } from "arktype"
import { IconDashboard, IconSettings, IconShieldCheck } from "justd-icons"
import { CopyField } from "~/components/copy-field"
import { DeleteAppDialog } from "~/components/delete-app-dialog"
import { providers } from "~/components/forms/authorization-form"
import { UpdateAppForm } from "~/components/forms/update-app-form"
import { UpsertJwtForm } from "~/components/forms/upsert-jwt-form"
import { Card, Heading, Loader, Note, Tabs } from "~/components/ui"
import { useApi } from "~/lib/api/client"
import { AnalyticsPage } from "./-components/analytics-page"

const searchParams = type({
	"tab?": "string",
	"duration?": "string",
})

export const Route = createFileRoute("/_app/$id")({
	component: RouteComponent,
	validateSearch: searchParams,
})

function RouteComponent() {
	const $api = useApi()

	const { id } = Route.useParams()
	const { tab, duration } = Route.useSearch()

	const navigate = useNavigate()

	const { data: item, isLoading } = $api.useSuspenseQuery("get", "/app/{id}", { params: { path: { id } } })

	if (isLoading) {
		return (
			<div>
				<Loader />
			</div>
		)
	}

	if (!item) {
		return (
			<div>
				<h1>Not Found</h1>
			</div>
		)
	}

	const provider = item.jwt?.provider ? providers[item.jwt.provider] : null

	return (
		<div className="space-y-6">
			{!item.jwt && (
				<Note intent="warning">
					No Auth Provider is currently not setup for this app. Please setup an auth provider to use this app.
					<br />
					You can find it{" "}
					<Link to="/$id" params={{ id }} search={{ tab: "authorization" }}>
						here
					</Link>
				</Note>
			)}
			<div className="flex flex-col justify-between gap-2 md:flex-row">
				<div className="flex items-center gap-2">
					{provider && <provider.icon className="size-8" />}
					<Heading level={1}>{item.name}</Heading>
				</div>

				<CopyField value={`${import.meta.env.VITE_BACKEND_URL}/electric/${id}/v1/shape`} />
			</div>

			<Tabs
				selectedKey={tab}
				onSelectionChange={(key) =>
					navigate({
						to: "/$id",
						params: { id },
						search: { tab: key.toString() },
					})
				}
				aria-label="App Tabs"
			>
				<Tabs.List>
					<Tabs.Tab id="overview">
						<IconDashboard />
						Overview
					</Tabs.Tab>
					<Tabs.Tab id="authorization">
						<IconShieldCheck />
						Auth Provider
					</Tabs.Tab>
					<Tabs.Tab id="settings">
						<IconSettings />
						Settings
					</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel className="space-y-6" id="overview">
					<AnalyticsPage id={id} duration={duration} />
				</Tabs.Panel>
				<Tabs.Panel id="authorization">
					<Card className="p-6">
						{/* @ts-expect-error */}
						<UpsertJwtForm appId={id} jwt={item.jwt} />
					</Card>
				</Tabs.Panel>

				<Tabs.Panel className="space-y-6" id="settings">
					<Card>
						<Card.Header>
							<Card.Title>App Settings</Card.Title>
						</Card.Header>
						<Card.Footer>
							{/* @ts-expect-error */}
							<UpdateAppForm id={id} initalData={item} />
						</Card.Footer>
					</Card>
					<Card>
						<Card.Header>
							<Card.Title>Destructive Actions</Card.Title>
							<Card.Description>These actions are irreversible</Card.Description>
						</Card.Header>
						<Card.Footer>
							<DeleteAppDialog id={id} />
						</Card.Footer>
					</Card>
				</Tabs.Panel>
			</Tabs>
		</div>
	)
}
