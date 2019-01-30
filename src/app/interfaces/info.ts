export interface IProject {
	/** The project's unique id */
	created_at: number | Date;
	/** The project's name */
	name: string;
	/** The project's description */
	description?: string | null;
}

export interface ILimits {
	/** The limits for properties */
	properties: { [k: string]: boolean };
	/** Denotes if the user can deal with accesses */
	accesses: boolean;
	/** The max number of allowed models */
	models: number;
	/** The max number of allowed fields by models */
	fields: number;
	/** The max number of allowed templates */
	templates: number;
}

export interface IInfo {
	project: IProject;
	limits: ILimits;
}
