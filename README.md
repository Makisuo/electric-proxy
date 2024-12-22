# Electric Auth Proxy

> [!CAUTION]
> Currently just works with Clerk but plan to support other auth providers/generic JWKS


This is a small api and web ui to handle a Electric Auth Proxy.
This works by consuming a JWT to verify the user and then filter shapes based on the user's id/tenant id.

You are able to customize the id to filter shapes by as example `userId` or `tenantId`.

It is also possible to defined public tables, this will return the full shape of the table.


## Local Development

### Run migrations

```bash
bun run setup
```

### Run the services

```bash
bun run dev
```

### Open the UI

(http://localhost:3001)[http://localhost:3001]






