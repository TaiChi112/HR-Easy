import { Elysia } from "elysia";
import { hrController } from "../../../modules/hr/hr.controller";

const app = new Elysia({ prefix: "/api" }).use(hrController);

export type AppType = typeof app;

export const runtime = "nodejs";

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
