import React, { ReactElement, useState } from "react";
import { ScrollView, TextInput, Button, Alert } from "react-native";
import { Auth } from "aws-amplify";
import styles from "./login.styles";

export default function Login(): ReactElement {
	const [login, setLogin] = useState({
		username: "",
		password: "",
	});
	const setLoginInput = (key: keyof typeof login, value: string) => {
		setLogin({ ...login, [key]: value });
	};

	// const signup = async () => {
	// 	try {
	// 		const res = await Auth.signUp({
	// 			username: "test",
	// 			password: "12345678",
	// 			attributes: {
	// 				email: "test@test.com",
	// 				name: "tester",
	// 			},
	// 		});
	// 		console.log(res);
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	const submit = async () => {
		const { username, password } = login;
		try {
			const res = await Auth.signIn(username, password);
			console.log(res);
		} catch (err) {
			console.log(err);
			Alert.alert("error", err.message || "An error occured");
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<TextInput
				value={login.username}
				onChangeText={(value) => setLoginInput("username", value)}
				returnKeyType="next"
				onSubmitEditing={() => alert(true)}
				placeholder="Username"
				placeholderTextColor="white"
				style={{
					height: 50,
					width: "100%",
					borderBottomWidth: 1,
					borderColor: "green",
					backgroundColor: "black",
					padding: 10,
					color: "white",
				}}
			/>
			<TextInput
				value={login.password}
				onChangeText={(value) => setLoginInput("password", value)}
				secureTextEntry
				placeholder="Password"
				placeholderTextColor="white"
				style={{
					height: 50,
					width: "100%",
					borderBottomWidth: 1,
					borderColor: "green",
					backgroundColor: "black",
					padding: 10,
					color: "white",
				}}
			/>
			<Button title="Login" onPress={submit}></Button>
		</ScrollView>
	);
}
