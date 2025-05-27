import { type HasHttpException, HTTPException } from "@server/errors/http";
import { UnprocessableEntityException } from "@server/errors/http";
import type { ObjectData } from "@server/types";
import type { ZodError } from "zod";

export type ValidationErrorData<T extends ObjectData> = {
	[K in keyof T]?: string[];
};

export class ValidationError<T extends ObjectData>
	extends Error
	implements HasHttpException
{
	constructor(public errors: ValidationErrorData<T>) {
		super("Validation Error");
	}

	static withMessages<T extends ObjectData>(errors: ValidationErrorData<T>) {
		return new ValidationError(errors);
	}

	static fromZodError<T extends ObjectData>(errors: ZodError<T>) {
		return new ValidationError<T>(
			errors.flatten().fieldErrors as ValidationErrorData<T>,
		);
	}

	toHttpException(): HTTPException {
		return new UnprocessableEntityException(this.errors);
	}
}

export class HashVerifyError extends Error implements HasHttpException {
	constructor(message = "Hash Verify Error") {
		super(message);
	}

	toHttpException(): HTTPException {
		return HTTPException.internalServerError(this.message);
	}
}

export class HashMakeError extends Error implements HasHttpException {
	constructor(message = "Hash Make Error") {
		super(message);
	}

	toHttpException(): HTTPException {
		return HTTPException.internalServerError(this.message);
	}
}
