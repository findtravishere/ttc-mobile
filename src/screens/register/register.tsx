import React, { ReactElement, useState } from "react";
import { ScrollView, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "../../config/navigator";
import { Text } from "../../components";
import { Auth } from "aws-amplify";
import OTPInput from "@twotalltotems/react-native-otp-input";
import styles from "./register.styles";

type RegisterProps = {
	navigation: StackNavigationProp<StackNavigatorParams, "Register">;
};

export default function Register({ navigation }: RegisterProps): ReactElement {
	const [login, setLogin] = useState({
		username: "",
		email: "",
		name: "",
		password: "",
	});
	const setLoginInput = (key: keyof typeof login, value: string) => {
		setLogin({ ...login, [key]: value });
	};
	const [step, setStep] = useState<"register" | "otp">("register");
	const submitCode = async (code: string) => {
		try {
			await Auth.confirmSignUp(login.username, code);
			navigation.navigate("Login");
			Alert.alert("Success", "Succesfully registered, please login");
		} catch (err) {
			Alert.alert("error", err.message || "An error occured");
		}
	};
	const register = async () => {
		const { username, password, email, name } = login;
		try {
			await Auth.signUp({ username, password, attributes: { email, name } });
			setStep("otp");
		} catch (err) {
			console.log(err);
			Alert.alert("error", err.message || "An error occured");
		}
	};
	const resendCode = async (username: string) => {
		try {
			await Auth.resendSignUp(username);
			Alert.alert("Please check your inbox for the new code");
		} catch (err) {
			Alert.alert("error", err.message || "An error occured");
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			{step === "otp" ? (
				<>
					<Text>Please enter the code you received in your email</Text>
					<OTPInput
						pinCount={6}
						onCodeFilled={(code) => {
							submitCode(code);
						}}
					/>
					<TouchableOpacity onPress={() => resendCode(login.username)}>
						<Text>Resend Code</Text>
					</TouchableOpacity>
				</>
			) : step === "register" ? (
				<>
					<TextInput
						value={login.username}
						onChangeText={(value) => setLoginInput("username", value)}
						returnKeyType="next"
						onSubmitEditing={() => alert(true)}
						placeholder="Username"
						placeholderTextColor="grey"
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
						keyboardType="email-address"
						value={login.email}
						onChangeText={(value) => setLoginInput("email", value)}
						returnKeyType="next"
						onSubmitEditing={() => alert(true)}
						placeholder="Email"
						placeholderTextColor="grey"
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
						value={login.name}
						onChangeText={(value) => setLoginInput("name", value)}
						returnKeyType="next"
						onSubmitEditing={() => alert(true)}
						placeholder="Name"
						placeholderTextColor="grey"
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
						placeholderTextColor="grey"
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
					<Button title="Register" onPress={register}></Button>
				</>
			) : null}
		</ScrollView>
	);
}
