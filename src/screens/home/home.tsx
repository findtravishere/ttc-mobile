import React, { ReactElement, useState } from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import styles from "./home.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import { Text, Button } from "@components";
import { useLogged } from "../../contexts/logged-context";
import { Auth } from "aws-amplify";

type HomeProps = {
	navigation: StackNavigationProp<StackNavigatorParams, "Home">;
};

export default function Home({ navigation }: HomeProps): ReactElement {
	const { user } = useLogged();
	const [signOut, setSignOut] = useState(false);
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={{ fontSize: 30, marginBottom: 50 }}>SERVERLESS TIC TAC TOE</Text>
			<Button onPress={() => navigation.navigate("Game")} title="Game" />
			<Button
				onPress={async () => {
					if (user) {
						setSignOut(true);
						try {
							await Auth.signOut();
						} catch (err) {
							Alert.alert("error!", "error signing out");
						}
						setSignOut(false);
					} else {
						navigation.navigate("Login");
					}
				}}
				title={user ? "Logout" : "Login"}
			/>

			{user && <Text style={{ marginTop: 400, fontSize: 20, color: "green" }}>Logged in as {user.username}</Text>}
		</ScrollView>
	);
}
