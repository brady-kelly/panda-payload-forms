import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import {
	BoldFeature,
	FixedToolbarFeature,
	HeadingFeature,
	InlineToolbarFeature,
	ItalicFeature,
	lexicalEditor,
	LinkFeature,
} from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Pages } from "./collections/Pages";
import { Users } from "./collections/Users";
import { MainMenu } from "./globals/MainMenu";
import { JobApplications } from "./collections/Applications/applications";

export const maxCvSize = 2 * 1024 * 1024;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
	admin: {
		importMap: {
			baseDir: path.resolve(dirname),
		},
		user: Users.slug,
	},
	collections: [Pages, Users, JobApplications],
	// We need to set CORS rules pointing to our hosted domains for the frontend to be able to submit to our API
	cors: [process.env.NEXT_PUBLIC_PAYLOAD_URL || ""],
	db: mongooseAdapter({
		url: "mongodb://127.0.0.1/payload-example-form-builder",
	}),
	editor: lexicalEditor({
		features: () => {
			return [
				BoldFeature(),
				ItalicFeature(),
				LinkFeature({ enabledCollections: ["pages"] }),
				HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3"] }),
				FixedToolbarFeature(),
				InlineToolbarFeature(),
			];
		},
	}),
	globals: [MainMenu],
	graphQL: {
		schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
	},
	plugins: [
		formBuilderPlugin({
			fields: {
				payment: false,
				upload: true,
			},
			formOverrides: {
				fields: undefined,
			},
			formSubmissionOverrides: {
				fields: ({ defaultFields }) => [
					...defaultFields,
					{
						name: "cvfile",
						type: "upload",
						relationTo: "job-applications", // Your upload-enabled collection
					},
				],
			},
			uploadCollections: ["job-applications"], // Required — available upload collections
		}),
	],
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	upload: {
		limits: {
			fileSize: maxCvSize, // 5MB, written in bytes
		},
	},
});
