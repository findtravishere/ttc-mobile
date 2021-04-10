import React, { ReactElement } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Text } from "@components";

type ButtonProps = {
	title: string;
} & TouchableOpacityProps;

export default function Button({ title, ...props }: ButtonProps): ReactElement {
	return (
		<TouchableOpacity {...props}>
			<Text>{title}</Text>
		</TouchableOpacity>
	);
}
