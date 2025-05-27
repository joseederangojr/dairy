import type {
	ColumnType,
	Generated,
	Insertable,
	Selectable,
	Updateable,
} from "kysely";

export interface CreatedAt {
	createdAt: ColumnType<Date, never, never>;
}

export interface UpdatedAt {
	updatedAt: ColumnType<Date, never, Date>;
}

export interface DeletedAt {
	deletedAt: ColumnType<Date | null, never, Date | null>;
}

export enum UserRoleEnum {
	ADMIN = 0,
	MARKETING = 1,
	PRODUCTION = 2,
	CASHIER = 3,
	DELIVERY = 4,
}

interface UserTable extends CreatedAt, UpdatedAt, DeletedAt {
	id: Generated<string>;
	name: string;
	email: string;
	password: string;
	role: UserRoleEnum;
}

export interface UserSelect extends Selectable<UserTable> {}
export interface UserInsert extends Insertable<UserTable> {}
export interface UserUpdated extends Updateable<UserTable> {}

export interface Database {
	users: UserTable;
}
