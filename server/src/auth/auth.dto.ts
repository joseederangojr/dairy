import { UserRoleEnum } from "@server/database/types";
import * as z from "zod";

const loginDto = z.object({
	email: z
		.string({
			required_error: "Email is required.",
		})
		.min(1, {
			message: "Email is required.",
		}),
	password: z
		.string({
			required_error: "Password is required.",
		})
		.min(1, {
			message: "Password is required.",
		}),
});

export type LoginDto = z.infer<typeof loginDto>;

export const parseLoginDto = (data: unknown) => {
	return loginDto.parseAsync(data);
};

const registerDto = z.object({
	name: z
		.string({
			required_error: "Name is required.",
		})
		.min(5, {
			message: "Name should have atleast 5 characters.",
		}),
	email: z
		.string({
			required_error: "Email is required.",
		})
		.min(1, {
			message: "Email is required.",
		}),
	password: z
		.string({
			required_error: "Password is required.",
		})
		.min(8, {
			message: "Password should have atleast 8 characters",
		}),

	role: z.nativeEnum(UserRoleEnum),
});

export type RegisterDto = z.infer<typeof registerDto>;

export const parseRegisterDto = (data: unknown) => {
	return registerDto.parseAsync(data);
};
