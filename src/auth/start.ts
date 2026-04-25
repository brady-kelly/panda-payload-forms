import type { AccessArgs } from "payload";

import type { User } from "@/payload-types";

type isAuthenticated = (args: AccessArgs<User>) => boolean;

export const authenticated: isAuthenticated = ({ req: { user } }) => {
	return Boolean(user);
};

import type { Access } from "payload";

export const publishedOnly: Access = ({ req: { user } }) => {
	if (user) {
		return true;
	}

	return {
		_status: {
			equals: "published",
		},
	};
};
