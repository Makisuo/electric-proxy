import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { type } from "arktype"
import { IconChartBar, IconDashboard, IconSettings, IconShieldCheck } from "justd-icons"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { CopyField } from "~/components/copy-field"
import { DeleteAppDialog } from "~/components/delete-app-dialog"
import { UpdateAppForm } from "~/components/forms/update-app-form"
import { UpsertJwtForm } from "~/components/forms/upsert-jwt-form"
import {
	Card,
	Chart,
	type ChartConfig,
	ChartTooltip,
	ChartTooltipContent,
	Heading,
	Loader,
	Note,
	Tabs,
} from "~/components/ui"
import { useApi } from "~/lib/api/client"

const searchParams = type({
	"tab?": "string",
})

export const Route = createFileRoute("/_app/$id")({
	component: RouteComponent,
	validateSearch: searchParams,
	loader: ({ context }) => {},
})

const numberFormatter = new Intl.NumberFormat("en-US", {
	maximumSignificantDigits: 5,
})

const chartConfig = {
	unique: {
		label: "Unique Users",
		color: "var(--chart-1)",
	},
	total: {
		label: "Total Requests",
		color: "var(--chart-2)",
		icon: IconChartBar,
	},
	error: {
		label: "Error Count",
		color: "var(--danger)",
	},
} satisfies ChartConfig

function RouteComponent() {
	const $api = useApi()

	const { id } = Route.useParams()
	const { tab } = Route.useSearch()

	const navigate = useNavigate()

	const { data: item, isLoading } = $api.useSuspenseQuery("get", "/app/{id}", { params: { path: { id } } })

	const { data: analytics, isLoading: isLoadingAnalytics } = $api.useQuery("get", "/app/{id}/analytics", {
		params: {
			path: {
				id,
			},
		},
	})

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

	const totalAnalytics = analytics?.reduce(
		(acc, curr) => {
			acc.total += Number(curr.totalRequests)
			acc.unique += Number(curr.uniqueUsers)
			acc.errors += Number(curr.errorCount)
			return acc
		},
		{
			total: 0,
			unique: 0,
			errors: 0,
		},
	) || { total: 0, unique: 0, errors: 0 }

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
				<Heading level={1}>{item.name}</Heading>
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
					<div className="flex flex-col gap-2 md:flex-row">
						<AnalytcisCard title="Total Requests" value={totalAnalytics.total} />
						<AnalytcisCard title="Unique Users" value={totalAnalytics.unique} />
						<AnalytcisCard title="Error Count" value={totalAnalytics.errors} />
					</div>

					<Card>
						<Card.Header title="Overview" description="Last 12 hours" />
						<Card.Content>
							<Chart className="h-[180px] w-full md:h-[320px]" config={chartConfig}>
								<LineChart
									accessibilityLayer
									data={analytics}
									margin={{
										left: 12,
										right: 12,
									}}
								>
									<CartesianGrid vertical={false} />
									<YAxis
										hide
										domain={[
											0,
											Math.max(
												...(analytics || []).map((item) =>
													Math.max(
														Number(item.uniqueUsers),
														Number(item.totalRequests),
														Number(item.errorCount),
													),
												),
											),
										]}
										type="number"
									/>
									<XAxis
										dataKey="hour"
										tickLine={false}
										axisLine={false}
										tickMargin={12}
										tickFormatter={(v: string) =>
											Intl.DateTimeFormat("en-US", {
												hour: "numeric",
												timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
												minute: "numeric",
												month: "short",
												day: "numeric",
											}).format(new Date(`${v}Z`))
										}
									/>
									<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
									<Line
										type="monotone"
										dataKey="uniqueUsers"
										stroke="var(--color-unique)"
										strokeWidth={2}
										dot={false}
									/>
									<Line
										type="monotone"
										dataKey="totalRequests"
										stroke="var(--color-total)"
										strokeWidth={2}
										dot={false}
									/>
									<Line
										type="monotone"
										dataKey="errorCount"
										stroke="var(--color-error)"
										strokeWidth={2}
										dot={false}
									/>
								</LineChart>
							</Chart>
						</Card.Content>
					</Card>
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

const AnalytcisCard = ({ title, value }: { title: string; value: number }) => {
	return (
		<Card className="w-full">
			<Card.Header>
				<Card.Title>{title}</Card.Title>
				<Card.Description>Last 12 Hours</Card.Description>
			</Card.Header>
			<Card.Content>
				<p className="text-4xl">{numberFormatter.format(value)}</p>
			</Card.Content>
		</Card>
	)
}
