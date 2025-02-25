/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health Check */
        get: operations["Root.health"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/electric/{id}/v1/shape": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["Electric.v1/shape"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/electric/v1/verify-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Electric.v1/verifyUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new app */
        post: operations["App.createApp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app/{id}/jwt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["App.upsertJwt"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/apps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["App.getApps"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["App.getApp"];
        put: operations["App.updateApp"];
        post?: never;
        delete: operations["App.deleteApp"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/app/{id}/analytics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["App.getAnalytics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/verify-token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Auth.verifyAuthToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/verify-jwt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["Auth.verifyJwt"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/better-auth/*": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["BetterAuth.betterAuthGet"];
        put?: never;
        post: operations["BetterAuth.betterAuthPost"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description The request did not match the expected schema */
        HttpApiDecodeError: {
            issues: components["schemas"]["Issue"][];
            message: string;
            /** @enum {string} */
            _tag: "HttpApiDecodeError";
        };
        /** @description Represents an error encountered while parsing a value to match the schema */
        Issue: {
            /**
             * @description The tag identifying the type of parse issue
             * @enum {string}
             */
            _tag: "Pointer" | "Unexpected" | "Missing" | "Composite" | "Refinement" | "Transformation" | "Type" | "Forbidden";
            /** @description The path to the property where the issue occurred */
            path: components["schemas"]["PropertyKey"][];
            /** @description A descriptive message explaining the issue */
            message: string;
        };
        PropertyKey: string | number | {
            /** @enum {string} */
            _tag: "symbol";
            key: string;
        };
        /** App.jsonCreate */
        "App.jsonCreate": {
            /**
             * minLength(3)
             * @description a string at least 3 character(s) long
             */
            name: string;
            /**
             * trimmed
             * @description a string with no leading or trailing whitespace
             */
            clerkSecretKey: string | null;
            electricUrl: string;
            publicTables: string[];
            tenantColumnKey: string;
            auth: ({
                /** @enum {string} */
                type: "bearer";
                credentials: string;
            } | {
                /** @enum {string} */
                type: "basic";
                username: string;
                password: string;
            } | {
                /** @enum {string} */
                type: "electric-cloud";
                sourceId: string;
                sourceSecret: string;
            }) | null;
        };
        /** App.json */
        "App.json": {
            id: string;
            /**
             * minLength(3)
             * @description a string at least 3 character(s) long
             */
            name: string;
            /**
             * trimmed
             * @description a string with no leading or trailing whitespace
             */
            clerkSecretKey: string | null;
            electricUrl: string;
            publicTables: string[];
            tenantColumnKey: string;
            auth: ({
                /** @enum {string} */
                type: "bearer";
                credentials: string;
            } | {
                /** @enum {string} */
                type: "basic";
                username: string;
                password: string;
            } | {
                /** @enum {string} */
                type: "electric-cloud";
                sourceId: string;
                sourceSecret: string;
            }) | null;
            jwtId: string | null;
            tenantId: string;
        };
        Unauthorized: {
            actorId: string;
            entity: string;
            action: string;
            /** @enum {string} */
            _tag: "Unauthorized";
        };
        /** Jwt.jsonUpdate */
        "Jwt.jsonUpdate": {
            /**
             * trimmed
             * @description a string with no leading or trailing whitespace
             */
            publicKey: string | null;
            publicKeyRemote: string | null;
            /** @enum {string|null} */
            alg: "RS256" | "PS256" | "RS256" | "EdDSA" | null;
            /** @enum {string|null} */
            provider: "clerk" | "custom" | "custom-remote" | null;
        };
        /** Jwt.json */
        "Jwt.json": {
            id: string;
            /**
             * trimmed
             * @description a string with no leading or trailing whitespace
             */
            publicKey: string | null;
            publicKeyRemote: string | null;
            /** @enum {string|null} */
            alg: "RS256" | "PS256" | "RS256" | "EdDSA" | null;
            /** @enum {string|null} */
            provider: "clerk" | "custom" | "custom-remote" | null;
        };
        AppNotFound: {
            id: string;
            /** @enum {string} */
            _tag: "AppNotFound";
        };
        /** App.jsonUpdate */
        "App.jsonUpdate": {
            /**
             * minLength(3)
             * @description a string at least 3 character(s) long
             */
            name: string;
            /**
             * trimmed
             * @description a string with no leading or trailing whitespace
             */
            clerkSecretKey: string | null;
            electricUrl: string;
            publicTables: string[];
            tenantColumnKey: string;
            auth: ({
                /** @enum {string} */
                type: "bearer";
                credentials: string;
            } | {
                /** @enum {string} */
                type: "basic";
                username: string;
                password: string;
            } | {
                /** @enum {string} */
                type: "electric-cloud";
                sourceId: string;
                sourceSecret: string;
            }) | null;
        };
        UniqueSchema: {
            hour: string;
            uniqueUsers: components["schemas"]["NumberFromString"];
            totalRequests: components["schemas"]["NumberFromString"];
            errorCount: components["schemas"]["NumberFromString"];
        };
        /** @description a string to be decoded into a number */
        NumberFromString: string;
        InvalidDuration: {
            message: string;
            /** @enum {string} */
            _tag: "InvalidDuration";
        };
        JoseError: {
            message: string;
            /** @enum {string} */
            _tag: "JoseError";
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "Root.health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description a string */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string;
                };
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
        };
    };
    "Electric.v1/shape": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
        };
    };
    "Electric.v1/verifyUrl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    url: string;
                    auth: {
                        /** @enum {string} */
                        type: "bearer";
                        credentials: string;
                    } | {
                        /** @enum {string} */
                        type: "basic";
                        username: string;
                        password: string;
                    } | {
                        /** @enum {string} */
                        type: "electric-cloud";
                        sourceId: string;
                        sourceSecret: string;
                    };
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        valid: boolean;
                    };
                };
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
        };
    };
    "App.createApp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["App.jsonCreate"];
            };
        };
        responses: {
            /** @description App.json */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["App.json"];
                };
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
            /** @description Unauthorized */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Unauthorized"];
                };
            };
        };
    };
    "App.upsertJwt": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Jwt.jsonUpdate"];
            };
        };
        responses: {
            /** @description Jwt.json */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Jwt.json"];
                };
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
            /** @description Unauthorized */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Unauthorized"];
                };
            };
        };
    };
    "App.getApps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["App.json"][];
                };
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
            /** @description Unauthorized */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Unauthorized"];
                };
            };
        };
    };
    "App.getApp": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        id: string;
                        /**
                         * minLength(3)
                         * @description a string at least 3 character(s) long
                         */
                        name: string;
                        /**
                         * trimmed
                         * @description a string with no leading or trailing whitespace
                         */
                        clerkSecretKey: string | null;
                        electricUrl: string;
                        publicTables: string[];
                        tenantColumnKey: string;
                        auth: ({
                            /** @enum {string} */
                            type: "bearer";
                            credentials: string;
                        } | {
                            /** @enum {string} */
                            type: "basic";
                            username: string;
                            password: string;
                        } | {
                            /** @enum {string} */
                            type: "electric-cloud";
                            sourceId: string;
                            sourceSecret: string;
                        }) | null;
                        jwtId: string | null;
                        tenantId: string;
                        jwt: components["schemas"]["Jwt.json"];
                    };
                };
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
            /** @description Unauthorized */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Unauthorized"];
                };
            };
            /** @description AppNotFound */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppNotFound"];
                };
            };
        };
    };
    "App.updateApp": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["App.jsonUpdate"];
            };
        };
        responses: {
            /** @description App.json */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["App.json"];
                };
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
            /** @description Unauthorized */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Unauthorized"];
                };
            };
            /** @description AppNotFound */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppNotFound"];
                };
            };
        };
    };
    "App.deleteApp": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
            /** @description Unauthorized */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Unauthorized"];
                };
            };
            /** @description AppNotFound */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppNotFound"];
                };
            };
        };
    };
    "App.getAnalytics": {
        parameters: {
            query?: {
                duration?: string;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UniqueSchema"][];
                };
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"] | components["schemas"]["InvalidDuration"];
                };
            };
            /** @description Unauthorized */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Unauthorized"];
                };
            };
        };
    };
    "Auth.verifyAuthToken": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @enum {string} */
                    type: "clerk";
                    credentials: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        valid: boolean;
                        id: string | null;
                        environmentType: string | null;
                    };
                };
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
        };
    };
    "Auth.verifyJwt": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @enum {string} */
                    alg: "RS256" | "PS256" | "RS256" | "EdDSA";
                    /**
                     * trimmed
                     * @description a string with no leading or trailing whitespace
                     */
                    jwtPublicKey: string;
                    jwt: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        tenantId: string | null;
                    };
                };
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
            /** @description JoseError */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JoseError"];
                };
            };
        };
    };
    "BetterAuth.betterAuthGet": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
        };
    };
    "BetterAuth.betterAuthPost": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The request did not match the expected schema */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HttpApiDecodeError"];
                };
            };
        };
    };
}
