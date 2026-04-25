/** biome-ignore-all assist/source/organizeImports: TODO: Imports */
/** biome-ignore-all lint/suspicious/noExplicitAny: Use of any */
import type { TextField } from "@payloadcms/plugin-form-builder/types";
import type {
	FieldErrorsImpl,
	FieldValues,
	UseFormRegister,
} from "react-hook-form";

import type React from "react";

import { Error as LocalError } from "../Error";
import { Width } from "../Width";
import classes from "./index.module.scss";

export const Upload: React.FC<
	{
		errors: Partial<
			FieldErrorsImpl<{
				[x: string]: any;
			}>
		>;
		register: UseFormRegister<any & FieldValues>;
	} & TextField
> = ({ name, errors, label, register, required: requiredFromProps, width }) => {
	return (
		<Width width={width}>
			<div className={classes.wrap}>
				<label className={classes.label} htmlFor={name}>
					{label}
				</label>
				<input
					className={classes.input}
					id={name}
					type="file"
					{...register(name, { required: requiredFromProps })}
				/>
				{requiredFromProps && errors[name] && <LocalError />}
			</div>
		</Width>
	);
};
