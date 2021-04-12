import React, { ReactElement, useState } from "react";
import { ScrollView, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "../../navigation/navigator";
import { Text } from "../../components";
import { RouteProp } from "@react-navigation/native";

import { Auth } from "aws-amplify";
import styles from "./login.styles";

type LoginProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "Login">;
    route: RouteProp<StackNavigatorParams, "Login">;
};

export default function Login({ navigation, route }: LoginProps): ReactElement {
    const redirect = route.params?.redirect;
    const [login, setLogin] = useState({
        username: "",
        password: ""
    });
    const setLoginInput = (key: keyof typeof login, value: string) => {
        setLogin({ ...login, [key]: value });
    };

    const submit = async () => {
        const { username, password } = login;
        try {
            const res = await Auth.signIn(username, password);
            redirect ? navigation.replace(redirect) : navigation.navigate("Home");
            console.log(res);
        } catch (err) {
            if (err.code === "UserNotConfirmedException") {
                navigation.navigate("Register");
            } else {
                console.log(err);
                Alert.alert("error", err.message || "An error occured");
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                value={login.username}
                onChangeText={value => setLoginInput("username", value)}
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
                    color: "white"
                }}
            />
            <TextInput
                value={login.password}
                onChangeText={value => setLoginInput("password", value)}
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
                    color: "white"
                }}
            />
            <Button title="Login" onPress={submit}></Button>
            <TouchableOpacity style={{ alignItems: "center", marginTop: 200 }}>
                <Text style={{ fontSize: 30 }}>Don't have an account?</Text>
                <Button onPress={() => navigation.navigate("Register")} title="Register"></Button>
            </TouchableOpacity>
        </ScrollView>
    );
}
