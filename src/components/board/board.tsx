import React, { ReactElement } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@components";

type Cell = "x" | "o" | null;
type BoardProps = {
	state: [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
	size: number;
	onCellPress: (index: number) => void;
};

export default function Board({ state, size, onCellPress }: BoardProps): ReactElement {
	return (
		<View
			style={{
				width: size,
				height: size,
				backgroundColor: "pink",
				flexDirection: "row",
				flexWrap: "wrap",
			}}
		>
			{state.map((cell, index) => {
				return (
					<TouchableOpacity
						onPress={() => onCellPress && onCellPress(index)}
						style={{
							width: "33.3333%",
							height: "33.33333%",
							borderWidth: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
						key={index}
					>
						<Text style={{ fontSize: size / 8 }}>{cell}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
