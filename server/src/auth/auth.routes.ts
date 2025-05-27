import { Hono } from "hono";
import AuthService from "./auth.service";
import { wrap } from "@server/lib/util";
import { ValidationError } from "@server/errors/index";
import { HTTPException } from "@server/errors/http";

const auth = new Hono();

auth.post("/login", async (c) => {
	const data = await c.req.json();
	const [loginError, loginData] = await wrap(AuthService.login(data));

	if (loginError) {
		if (loginError instanceof ValidationError) {
			throw loginError.toHttpException();
		}

		const httpException = HTTPException.hasHttpException(loginError);
		if (httpException) {
			throw httpException.toHttpException();
		}
		throw HTTPException.internalServerError();
	}

	return c.json(loginData);
});

auth.post("/register", async (c) => {
	const data = await c.req.json();
	const [registerError, registerData] = await wrap(AuthService.register(data));

	if (registerError) {
		if (registerError instanceof ValidationError) {
			throw registerError.toHttpException();
		}

		const httpException = HTTPException.hasHttpException(registerError);
		if (httpException) {
			throw httpException.toHttpException();
		}

		throw HTTPException.internalServerError(registerError.message);
	}

	return c.json(registerData, 201);
});

auth.onError((err) => {
	if (err instanceof HTTPException) {
		return err.toResponse();
	}

	return new HTTPException(HTTPException.InternalServerError, {
		message: "Unknown error occurred.",
	}).toResponse();
});

export default auth;
