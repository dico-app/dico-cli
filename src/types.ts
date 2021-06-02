export interface ConfigRC {
	user?: {
		token: string;
		fullname: string;
		email: string;
	};
	endpoint?: string;
}

export interface ConfigJSON {
	dico: string;
	sources: string[];
	schema: Structure["schema"];
	updated_at: string;
}

export enum Role {
	Admin = "admin",
	Developer = "developer",
	Writer = "writer"
}

export interface Dico {
	id: string;
	slug: string;
	name: string;
	owner_id: string;
	current_user_id: string;
	current_user_role: Role;
	is_owner: boolean;
}

export interface Structure {
	schema: { [key: string]: unknown };
	updated_at: string;
}
