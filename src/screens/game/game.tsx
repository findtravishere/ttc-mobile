import React, { ReactElement } from "react";
import { Text, SafeAreaView } from "react-native";
import styles from "./game.style";
import { Board } from "../../components/";

export default function Game(): ReactElement {
	return (
		<SafeAreaView style={styles.container}>
			<Board
				onCellPress={(index) => alert(index)}
				state={["x", "o", null, "x", "o", null, "x", "o", null]}
				size={400}
			/>
		</SafeAreaView>
	);
}
