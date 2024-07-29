import React from "react";
import "./inputs.scss";
import { TextField } from "@mui/material";

const Inputs = ({ id, e_name, labels, defaultValue, handleChange }) => {
	return (
		<div className="Inputs">
			<div className="field">
				<label htmlFor="document">{labels[0]}</label>
				<input
					id={id[2]}
					defaultValue={defaultValue[0]}
					name={e_name[0]}
					onChange={handleChange}
				/>
			</div>
			<div className="field">
				<label htmlFor="exp">{labels[1]}</label>
				<input
					id={id[1]}
					defaultValue={
						defaultValue ? defaultValue[1]?.slice(0, 10) : defaultValue
					}
					name={e_name[1]}
					placeholder="YYYY-MM-DD"
					onChange={handleChange}
				/>
			</div>
		</div>
	);
};

export default Inputs;
