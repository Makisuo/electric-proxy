import { createFileRoute } from "@tanstack/react-router"
import { IconChartBar } from "justd-icons"
import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { CopyField } from "~/components/copy-field"
import { DeleteAppDialog } from "~/components/delete-app-dialog"
import {
	Button,
	Card,
	Chart,
	type ChartConfig,
	ChartTooltip,
	ChartTooltipContent,
	Heading,
	Loader,
	Separator,
} from "~/components/ui"
import { UpdateAppForm } from "~/components/update-app-form"
import { useApi } from "~/lib/api/client"
import type { components } from "~/lib/api/v1"

export const Route = createFileRoute("/_app/$id")({
	component: RouteComponent,
	loader: ({ context }) => {},
})

const fillMissingHours = (
	analytics: {
		hour: string
		uniqueUsers: components["schemas"]["NumberFromString"]
		totalRequests: components["schemas"]["NumberFromString"]
		errorCount: components["schemas"]["NumberFromString"]
	}[],
) => {
	const parsedAnalytics = analytics.map((entry) => ({
		...entry,
		hour: new Date(entry.hour),
	}))

	const endTime = new Date().setMinutes(0, 0, 0)
	const startTime = new Date(endTime - 11 * 60 * 60 * 1000)

	const analyticsMap = new Map(parsedAnalytics.map((entry) => [entry.hour.getTime(), entry]))

	const result = []
	let currentTime = startTime

	while (currentTime.getTime() <= endTime) {
		const existing = analyticsMap.get(currentTime.getTime())
		result.push(
			existing || {
				hour: currentTime.toISOString(),
				uniqueUsers: "0",
				totalRequests: "0",
				errorCount: "0",
			},
		)
		currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000)
	}

	return result
}

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

	const { data, isLoading } = $api.useQuery("get", "/apps", {})

	const { data: analytics, isLoading: isLoadingAnalytics } = $api.useQuery("get", "/app/{id}/analytics", {
		params: {
			path: {
				id,
			},
		},
	})

	const item = useMemo(() => data?.find((item) => item.id === id), [data, id])

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

	console.log(fillMissingHours(analytics || []))

	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-2 md:flex-row">
				<Heading level={1}>{item.name}</Heading>
				<CopyField value={`${import.meta.env.VITE_BACKEND_URL}/electric/${id}/v1/shape`} />
			</div>

			<div className="flex flex-col gap-2 md:flex-row">
				<AnalytcisCard title="Total Requests" value={totalAnalytics.total} />
				<AnalytcisCard title="Unique Users" value={totalAnalytics.unique} />
				<AnalytcisCard title="Error Count" value={totalAnalytics.errors} />
			</div>

			<Card>
				<Card.Header title="Overview" description="Last 12 hours" />
				<Card.Content>
					<Chart className="max-h-[180px] w-full" config={chartConfig}>
						<LineChart
							accessibilityLayer
							data={fillMissingHours(analytics || [])}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
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
									}).format(new Date(v?.includes("Z") ? v : `${v}Z`))
								}
							/>
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<Line
								dataKey="uniqueUsers"
								type="natural"
								stroke="var(--color-unique)"
								strokeWidth={2}
								dot={false}
							/>
							<Line
								dataKey="totalRequests"
								type="natural"
								stroke="var(--color-total)"
								strokeWidth={2}
								dot={false}
							/>
							<Line
								dataKey="errorCount"
								type="natural"
								stroke="var(--color-error)"
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</Chart>
				</Card.Content>
			</Card>

			<Card>
				<Card.Header>
					<Card.Title>Update App</Card.Title>
				</Card.Header>
				<Card.Footer>
					<UpdateAppForm id={id} initalData={item} />
				</Card.Footer>
			</Card>
			<Separator />
			<Card>
				<Card.Header>
					<Card.Title>Destructive Actions</Card.Title>
					<Card.Description>These actions are irreversible</Card.Description>
				</Card.Header>
				<Card.Footer>
					<DeleteAppDialog id={id} />
				</Card.Footer>
			</Card>
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
