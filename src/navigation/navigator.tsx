import React, { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Home, Game, Login, Register, Matches } from "../screens";

export type StackNavigatorParams = {
    Home: undefined;
    Game: { gameID: string; invitee?: undefined } | { invitee: string; gameID?: undefined };
    Login: { redirect: keyof StackNavigatorParams } | undefined;
    Register: undefined;
    Matches: undefined;
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
                <Stack.Screen name="Matches" component={Matches} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
