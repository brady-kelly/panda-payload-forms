/** biome-ignore-all assist/source/organizeImports: TODO: Imports */
import type { CollectionConfig } from "payload";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { authenticated, publishedOnly } from "@/auth/start";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const JobApplicationFiles: CollectionConfig = {
	slug: "job-application-files",
	access: {
		read: publishedOnly,
		create: authenticated,
		delete: authenticated,
		update: authenticated,
	},
	fields: [
		{
			name: "cvfile",
			type: "upload",
			relationTo: "job-applications",
		},
	],
	upload: {
		staticDir: path.resolve(dirname, "../../public/applications"),
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
