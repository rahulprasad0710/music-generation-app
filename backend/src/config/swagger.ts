import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "MusicGPT API",
        version: "1.0.0",
        description: "MusicGPT Generation Platform — REST API Documentation",
    },
    servers: [
        {
            url: "http://localhost:8000/api",
            description: "Local",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            // --- Auth ---
            RegisterRequest: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string", example: "Rahul Shah" },
                    email: { type: "string", example: "rahul@example.com" },
                    password: { type: "string", example: "Password@123" },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", example: "rahul@example.com" },
                    password: { type: "string", example: "Password@123" },
                    isRememberMe: { type: "boolean", example: false },
                },
            },
            AuthResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                },
            },
            // --- Prompt ---
            PromptRequest: {
                type: "object",
                required: ["prompt"],
                properties: {
                    prompt: {
                        type: "string",
                        example: "A chill lo-fi hip hop beat with rain sounds",
                    },
                },
            },
            PromptResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    data: {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            status: {
                                type: "string",
                                enum: [
                                    "PENDING",
                                    "PROCESSING",
                                    "COMPLETED",
                                    "FAILED",
                                ],
                            },
                            prompt: { type: "string" },
                            createdAt: { type: "string", format: "date-time" },
                        },
                    },
                },
            },
            // --- Audio ---
            AudioResult: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    title: { type: "string" },
                    inputPrompt: { type: "string" },
                    audioUrl: { type: "string" },
                    hlsUrl: { type: "string", nullable: true },
                    thumbnail: { type: "string", nullable: true },
                    durationMs: { type: "integer", nullable: true },
                    playCount: { type: "integer" },
                    likeCount: { type: "integer" },
                    createdAt: { type: "string", format: "date-time" },
                    rank: { type: "integer" },
                },
            },
            PaginatedAudioResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    data: {
                        type: "object",
                        properties: {
                            results: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/AudioResult",
                                },
                            },
                            hasMore: { type: "boolean" },
                            nextCursor: { type: "string", nullable: true },
                        },
                    },
                },
            },
            // --- User ---
            UserResult: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    email: { type: "string" },
                    isPremium: { type: "boolean" },
                    isActive: { type: "boolean" },
                    isBlacklisted: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                },
            },
            PaginatedUserResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    data: {
                        type: "object",
                        properties: {
                            results: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/UserResult",
                                },
                            },
                            hasMore: { type: "boolean" },
                            nextCursor: { type: "string", nullable: true },
                        },
                    },
                },
            },
            // --- Error ---
            ErrorResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string" },
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    paths: {
        // =================== AUTH ===================
        "/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RegisterRequest",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "User registered",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthResponse",
                                },
                            },
                        },
                    },
                    400: {
                        description: "Validation error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/LoginRequest",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthResponse",
                                },
                            },
                        },
                    },
                    401: {
                        description: "Invalid credentials",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/auth/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Refresh access token",
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    refreshToken: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "New access token",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthResponse",
                                },
                            },
                        },
                    },
                    401: { description: "Invalid refresh token" },
                },
            },
        },
        "/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Logout — invalidates refresh token",
                responses: {
                    200: { description: "Logged out successfully" },
                    401: { description: "Unauthorized" },
                },
            },
        },
        // =================== PROMPTS ===================
        "/prompts": {
            post: {
                tags: ["Prompts"],
                summary: "Submit a music generation prompt",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PromptRequest",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Prompt queued",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PromptResponse",
                                },
                            },
                        },
                    },
                    429: {
                        description: "Rate limit exceeded",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                },
            },
            get: {
                tags: ["Prompts"],
                summary: "Get all prompts for current user",
                responses: {
                    200: { description: "List of prompts" },
                    401: { description: "Unauthorized" },
                },
            },
        },
        // =================== AUDIO ===================
        "/audios": {
            get: {
                tags: ["Audio"],
                summary: "Get paginated audio list with search",
                security: [],
                parameters: [
                    {
                        name: "q",
                        in: "query",
                        schema: { type: "string" },
                        description: "Search query",
                    },
                    {
                        name: "cursor",
                        in: "query",
                        schema: { type: "string" },
                        description: "Pagination cursor",
                    },
                ],
                responses: {
                    200: {
                        description: "Paginated audio results",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaginatedAudioResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/audios/users": {
            get: {
                tags: ["Audio"],
                summary: "Get current user's audio generations",
                parameters: [
                    { name: "q", in: "query", schema: { type: "string" } },
                    { name: "cursor", in: "query", schema: { type: "string" } },
                ],
                responses: {
                    200: {
                        description: "Paginated user audio",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaginatedAudioResponse",
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                },
            },
        },
        // =================== USERS ===================
        "/users": {
            get: {
                tags: ["Users"],
                summary: "Get paginated user list with search",
                parameters: [
                    { name: "q", in: "query", schema: { type: "string" } },
                    { name: "cursor", in: "query", schema: { type: "string" } },
                ],
                responses: {
                    200: {
                        description: "Paginated user results",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/PaginatedUserResponse",
                                },
                            },
                        },
                    },
                    401: { description: "Unauthorized" },
                },
            },
        },
        "/users/:id": {
            patch: {
                tags: ["Users"],
                summary: "Update a user",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "integer" },
                    },
                ],
                responses: {
                    200: { description: "User updated" },
                    401: { description: "Unauthorized" },
                },
            },
        },
    },
};

export const setupSwagger = (app: Express): void => {
    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, {
            customSiteTitle: "MusicGPT API Docs",
        }),
    );
    console.log("📄 Swagger docs available at http://localhost:8000/docs");
};
