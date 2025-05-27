type WrapReturn<ResolveData, RejectData> =
	| [RejectData]
	| [undefined, ResolveData];

export const wrap = async <Res = unknown, Rej = Error>(
	promise: Promise<Res>,
): Promise<WrapReturn<Res, Rej>> => {
	try {
		const response = await promise;
		return [undefined, response as Res] as const;
	} catch (err: unknown) {
		return [err as Rej] as const;
	}
};
