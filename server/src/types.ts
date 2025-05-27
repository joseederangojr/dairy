export type Any =
	| string
	| number
	| boolean
	| object
	| string[]
	| number[]
	| boolean[]
	| object[]
	| null[]
	| undefined[]
	| (string | number | boolean | object | null | undefined)[]
	| null
	| undefined;
export type ObjectData = Record<string, Any>;
