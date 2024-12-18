import { Hono } from "hono";

import * as schema from "./schema";

import { createClerkClient } from "@clerk/backend";
import { apiReference } from "@scalar/hono-api-reference";
import { drizzle } from "drizzle-orm/d1";
import { describeRoute, openAPISpecs } from "hono-openapi";
import { validator as zValidator } from "hono-openapi/zod";
import { cors } from "hono/cors";
import { nanoid } from "nanoid";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

app.get("/", (c) => {
	return c.text("OK!");
});

app.get(
	"/openapi",
	openAPISpecs(app, {
		documentation: {
			info: {
				title: "Hono",
				version: "1.0.0",
				description: "API for greeting users",
			},
			servers: [
				{
					url: "http://localhost:8484",
					description: "Local server",
				},
			],
		},
	}),
);

app.get(
	"/docs",
	apiReference({
		theme: "saturn",
		spec: {
			url: "/openapi",
		},
	}),
);

app.post(
	"api/app",
	describeRoute({
		description: "Create a new app",
	}),
	zValidator(
		"json",
		z.object({
			name: z.string(),
			clerkSecretKey: z.string(),
			clerkPublishableKey: z.string(),
			electricUrl: z.string(),
		}),
	),
	async (c) => {
		const db = drizzle(c.env.DB, { schema });

		const body = c.req.valid("json");

		const app = await db
			.insert(schema.appsTable)
			.values({
				id: nanoid(),
				...body,
			})
			.returning();

		return c.json(app);
	},
);

app.get("api/electric/:id/v1/shape", async (c) => {
	const id = c.req.param("id");

	const db = drizzle(c.env.DB, { schema });

	const app = await db.query.appsTable.findFirst({
		where: (table, { eq }) => eq(table.id, id),
	});

	if (!app) {
		return c.json(
			{
				message: "App not found",
			},
			404,
		);
	}

	const clerkClient = createClerkClient({
		secretKey: app.clerkSecretKey,
		publishableKey: app.clerkPublishableKey,
	});

	const requestState = await clerkClient.authenticateRequest(c.req.raw);

	if (!requestState.isSignedIn) {
		return c.json(
			{
				message: "You are not logged in.",
			},
			401,
		);
	}

	const url = new URL(c.req.url);
	const table = url.searchParams.get("table") as string;

	const originUrl = new URL("/v1/shape", app.electricUrl);

	if (!app.publicTables.includes(table)) {
		originUrl.searchParams.set(
			"where",
			`tenant_id = '${requestState.toAuth().sessionClaims.sub}'`,
		);
	}

	url.searchParams.forEach((value, key) => {
		if (["live", "table", "handle", "offset", "cursor"].includes(key)) {
			originUrl.searchParams.set(key, value);
		}
	});

	let resp = await fetch(originUrl.toString());
	if (resp.headers.get("content-encoding")) {
		const headers = new Headers(resp.headers);
		headers.delete("content-encoding");
		headers.delete("content-length");
		resp = new Response(resp.body, {
			status: resp.status,
			statusText: resp.statusText,
			headers,
		});
	}
	return resp;
});

export default app;
