/** biome-ignore-all assist/source/organizeImports: TODO: Imports */
import type { CollectionConfig } from "payload";
import { slugField } from "../../fields/slug";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { authenticated, publishedOnly } from "@/auth/start";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const JobApplications: CollectionConfig = {
	slug: "job-applications",
	folders: true,
	access: {
		read: publishedOnly,
		create: authenticated,
		delete: authenticated,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["fullName", "ogFilename", "updatedAt"],
		useAsTitle: "fullName",
	},
	fields: [
		{
			name: "firstName",
			label: "First Name",
			type: "text",
			required: true,
		},
		{
			name: "surname",
			label: "Surname",
			type: "text",
			required: true,
		},
		{
			name: "idNumber",
			label: "ID Number",
			type: "text",
			minLength: 13,
			maxLength: 13,
		},
		{
			name: "ogFilename",
			type: "text",
			required: true,
		},
		{
			name: "fullName",
			label: "Full Name",
			type: "text",
			admin: {
				readOnly: true,
			},
			hooks: {
				afterRead: [
					({ data }) => {
						// Concatenate real fields; handle potential missing data
						return `${data?.firstName || ""} ${data?.surname || ""}`.trim();
					},
				],
			},
		},
		slugField(),
	],
	upload: {
		staticDir: path.resolve(dirname, "../../public/media"),
		mimeTypes: [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		],
	},
	versions: {
		drafts: true,
	},
};
