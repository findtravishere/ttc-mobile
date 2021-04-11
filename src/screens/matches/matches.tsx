import React, { ReactElement } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "../../components";
import styles from "./matches.styles";
import { useLogged } from "../../contexts/logged-context";

export default function Matches(): ReactElement {
	const { user } = useLogged();
	return (
		<ScrollView contentContainerStyle={styles.container}>
			{user ? <Text>{user.username}</Text> : <View>you are not logged in</View>}
		</ScrollView>
	);
}
