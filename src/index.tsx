import React, { ReactElement } from "react";
import { Text, LoadUp } from "@components";
import Navigator from "./config/navigator";

export default function App(): ReactElement {
	return (
		<LoadUp>
			<Navigator></Navigator>
		</LoadUp>
	);
}
