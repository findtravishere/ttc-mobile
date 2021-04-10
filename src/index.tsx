import React, { ReactElement } from "react";
import { LoadUp } from "@components";
import Navigator from "./config/navigator";
import Amplify from "aws-amplify";
import awsExports from "../aws-exports";
Amplify.configure(awsExports);

export default function App(): ReactElement {
	return (
		<LoadUp>
			<Navigator></Navigator>
		</LoadUp>
	);
}
