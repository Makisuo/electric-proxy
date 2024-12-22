import { Schema } from "effect"

export const TenantId = Schema.String.pipe(Schema.brand("TenantId"))
export type TenantId = typeof TenantId.Type
