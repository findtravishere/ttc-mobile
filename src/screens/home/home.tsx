import React, { ReactElement } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import styles from "./home.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import { Button } from "@components";

type HomeProps = {
	navigation: StackNavigationProp<StackNavigatorParams, "Home">;
};

export default function Home({ navigation }: HomeProps): ReactElement {
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Button onPress={() => navigation.navigate("Game")} title="Game" />
			<Button onPress={() => alert(true)} title="Login" />
		</ScrollView>
	);
}
