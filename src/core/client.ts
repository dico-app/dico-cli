import _fetch from "node-fetch";
import { API_ENDPOINT } from "../const";
import * as dicorc from "./dicorc";
import * as messages from "../messages";
import { ConfigJSON, ConfigRC, Dico, Structure } from "../types";

class ClientError extends Error {}

export const fetch = async <R = { [key: string]: unknown }>(
	endpoint: string,
	token?: string,
	options?: { [key: string]: unknown }
): Promise<{ status: number; msg: string; data: R }> => {
	if (!token) {
		token = dicorc.read().user?.token;

		if (!token) {
			throw new ClientError(messages.NotSignedIn);
		}
	}

	const headers: { [key: string]: string } = {
		authorization: `Bearer ${token}`
	};

	// Populate headers with headers from options
	if (options && options.headers && typeof options.headers === "object") {
		Object.entries(options.headers).map(([k, v]) => {
			if (typeof v === "string") {
				headers[k] = v;
			}
		});
	}

	// Ensure body is JSON
	if (options && options.body) {
		options.body = JSON.stringify(options.body);
		headers["content-type"] = "application/json";
	}

	const response = await _fetch(
		`${dicorc.read().endpoint || API_ENDPOINT}${endpoint}`,
		{
			...options,
			headers
		}
	);

	const json = await response.json();

	if (!response.ok) {
		throw json || response;
	}

	return json;
};

export const user = {
	whoami: {
		run: async (token: string): Promise<Required<ConfigRC>["user"]> => {
			const {
				data: { fullname, email }
			} = await fetch<Required<ConfigRC>["user"]>("/whoami", token);

			return {
				token,
				fullname,
				email
			};
		}
	}
};

export const dico = {
	select: {
		all: {
			run: async (token?: string): Promise<Dico[]> => {
				const { data } = await fetch<Dico[]>("/dico", token);

				return data;
			}
		}
	}
};

export const structure = {
	select: {
		byDicoSlug: {
			run: async (slug: string, token?: string): Promise<Structure> => {
				const { data } = await fetch<Structure>(`/structure/${slug}`, token);

				return data;
			}
		}
	},
	update: {
		byDicoSlug: {
			schema: {
				run: async (
					slug: string,
					schema: ConfigJSON["schema"],
					token?: string
				): Promise<Structure> => {
					const { data } = await fetch<Structure>(`/structure/${slug}`, token, {
						method: "PUT",
						body: { schema }
					});

					return data;
				}
			}
		}
	}
};
