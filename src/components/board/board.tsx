import React, { ReactElement } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text } from "../../components";

type Cell = "x" | "o" | null;
type BoardProps = {
	state: [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
	size: number;
	onCellPress: (index: number) => void;
	loading?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | false;
	disabled?: boolean;
	children?: any;
};

export default function Board({ state, size, onCellPress, loading, disabled }: BoardProps): ReactElement {
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
						disabled={cell !== null || disabled}
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
						{loading === index ? (
							<ActivityIndicator color="purple" />
						) : (
							<Text style={{ fontSize: size / 8 }}>{cell}</Text>
						)}
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
