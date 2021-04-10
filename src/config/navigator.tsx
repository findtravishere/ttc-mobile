import React, { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Home, Game, Login, Register } from "@screens";

export type StackNavigatorParams = {
	Home: undefined;
	Game: undefined;
	Login: undefined;
	Register: undefined;
};

const Stack = createStackNavigator<StackNavigatorParams>();

export default function Navigator(): ReactElement {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={Home} />
				<Stack.Screen name="Game" component={Game} />
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Register" component={Register} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
