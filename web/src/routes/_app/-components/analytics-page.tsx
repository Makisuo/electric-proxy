import { useNavigate } from "@tanstack/react-router"
import { IconChartBar } from "justd-icons"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, Chart, type ChartConfig, ChartTooltip, ChartTooltipContent, Select } from "~/components/ui"
import { useApi } from "~/lib/api/client"

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

const dates = [
	{
		label: "Last 12 Hours",
		value: "12 hours",
	},
	{
		label: "Last 24 Hours",
		value: "24 hours",
	},
	{
		label: "Last 7 Days",
		value: "7 days",
	},
	{
		label: "Last 30 Days",
		value: "30 days",
	},
	{
		label: "Last 90 Days",
		value: "90 days",
	},
]

export const AnalyticsPage = ({ id, duration = "24 hours" }: { id: string; duration?: string }) => {
	const $api = useApi()

	const navigate = useNavigate()

	const { data: analytics, isLoading: isLoadingAnalytics } = $api.useQuery("get", "/app/{id}/analytics", {
		params: {
			path: {
				id: "0_Rg22jKqy-C86PVMnEJC",
			},
			query: {
				duration,
			},
		},
	})

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

	const computedAnalytics = analytics?.map((entry) => ({
		totalRequests: Number(entry.totalRequests),
		uniqueUsers: Number(entry.uniqueUsers),
		errorCount: Number(entry.errorCount),
		hour: entry.hour,
	}))

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-end">
				<Select
					className="max-w-[200px]"
					selectedKey={duration}
					onSelectionChange={(key) =>
						navigate({
							to: "/$id",
							search: { duration: key.toString() },
							params: { id },
						})
					}
				>
					<Select.Trigger />
					<Select.List items={dates}>
						{(item) => (
							<Select.Option id={item.value} textValue={item.label}>
								{item.label}
							</Select.Option>
						)}
					</Select.List>
				</Select>
			</div>
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
							data={computedAnalytics}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<YAxis hide domain={[0, "dataMax"]} type="number" />
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
