import type { ObjectData } from "@server/types";
import type { ValidationError } from "@server/errors/index";

export interface HasHttpException {
	toHttpException(): HTTPException;
}

export class HTTPException<
	TData extends ObjectData = ObjectData,
> extends Error {
	constructor(
		public statusCode: number,
		public metadata: { message?: string; data?: TData },
	) {
		super(metadata.message);
	}

	toResponse(init?: ResponseInit): Response {
		return new Response(JSON.stringify(this.metadata.data), {
			status: this.statusCode,
			...init,

			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	static unprocessibleEntity<T extends ObjectData = ObjectData>(
		errors: UnprocessableEntityErrorData<T>,
	): UnprocessableEntityException<T> {
		return new UnprocessableEntityException(errors);
	}

	static notFound(message?: string): NotFoundException {
		return new NotFoundException(message);
	}

	static badRequest(message?: string): BadRequestException {
		return new BadRequestException(message);
	}

	static internalServerError(message?: string): InternalServerErrorException {
		return new InternalServerErrorException(message);
	}

	static hasHttpException(error: unknown): HasHttpException | false {
		if ("toHttpException" in (error as HasHttpException)) {
			return error as HasHttpException;
		}

		return false;
	}

	static Continue = 100;
	static SwitchingProtocols = 101;
	static Processing = 102;
	static EarlyHints = 103;

	static OK = 200;
	static Created = 201;
	static Accepted = 202;
	static NonAuthoritativeInformation = 203;
	static NoContent = 204;
	static ResetContent = 205;
	static PartialContent = 206;

	static MultipleChoices = 300;
	static MovedPermanently = 301;
	static Found = 302;
	static SeeOther = 303;
	static NotModified = 304;
	static TemporaryRedirect = 307;
	static PermanentRedirect = 308;

	static BadRequest = 400;
	static Unauthorized = 401;
	static PaymentRequired = 402;
	static Forbidden = 403;
	static NotFound = 404;
	static MethodNotAllowed = 405;
	static NotAcceptable = 406;
	static ProxyAuthenticationRequired = 407;
	static RequestTimeout = 408;
	static Conflict = 409;
	static Gone = 410;
	static LengthRequired = 411;
	static PreconditionFailed = 412;
	static PayloadTooLarge = 413;
	static URITooLong = 414;
	static UnsupportedMediaType = 415;
	static RangeNotSatisfiable = 416;
	static ExpectationFailed = 417;
	static ImATeapot = 418;
	static UnprocessableEntity = 422;
	static TooManyRequests = 429;

	static InternalServerError = 500;
	static NotImplemented = 501;
	static BadGateway = 502;
	static ServiceUnavailable = 503;
	static GatewayTimeout = 504;
	static HTTPVersionNotSupported = 505;
}

export type UnprocessableEntityErrorData<T extends ObjectData> = {
	[K in keyof T]?: string[];
};

export class UnprocessableEntityException<
	T extends ObjectData,
> extends HTTPException<UnprocessableEntityErrorData<T>> {
	constructor(public errors: UnprocessableEntityErrorData<T>) {
		super(HTTPException.UnprocessableEntity, {
			message: "Unprocessable Entity",
			data: errors,
		});
	}

	static fromValidationError<T extends ObjectData>(
		error: ValidationError<T>,
	): UnprocessableEntityException<T> {
		return error.toHttpException() as UnprocessableEntityException<T>;
	}
}

export class NotFoundException extends HTTPException {
	constructor(message?: string) {
		super(HTTPException.NotFound, {
			message: message ?? "Not Found",
		});
	}
}
export class BadRequestException extends HTTPException {
	constructor(message?: string) {
		super(HTTPException.BadRequest, {
			message: message ?? "Bad Request",
		});
	}
}

export class InternalServerErrorException extends HTTPException {
	constructor(message?: string) {
		super(HTTPException.InternalServerError, {
			message: message ?? "Internal Server Error",
		});
	}
}
