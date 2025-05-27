import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import authRoutes from "./auth/auth.routes";
import environment from "./environment";
const app = new Hono().basePath("/api");

app.route("/auth", authRoutes);

app.get("/", (c) => {
	return c.text("Welcome to Dairy");
});

if (environment.app.environment !== "production") {
	showRoutes(app);
}

export default app;
