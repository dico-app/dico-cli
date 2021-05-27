import _fetch from "node-fetch";
import { API_ENDPOINT } from "../lib";
import { Config } from "./dicorc";

export const fetch = async <R>(
	endpoint: string,
	token: string,
	options?: { [key: string]: unknown }
): Promise<{ status: number; msg: string; data: R }> => {
	const headers: { [key: string]: string } = {
		authorization: `Bearer ${token}`
	};

	if (options && options.headers && typeof options.headers === "object") {
		Object.entries(options.headers).map(([k, v]) => {
			if (typeof v === "string") {
				headers[k] = v;
			}
		});
	}

	const response = await _fetch(`${API_ENDPOINT}${endpoint}`, {
		...options,
		headers
	});

	const json = await response.json();

	if (!response.ok) {
		throw json || response;
	}

	return json;
};

export const whoami = async (
	token: string
): Promise<Required<Config>["user"]> => {
	const {
		data: { fullname, email }
	} = await fetch<Required<Config>["user"]>("/whoami", token);

	return {
		token,
		fullname,
		email
	};
};
