import React, { ReactElement, useEffect, useState } from "react";
import { SafeAreaView, Alert } from "react-native";
import styles from "./game.style";
import { RouteProp } from "@react-navigation/native";
import { StackNavigatorParams } from "../../config/navigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { Board } from "../../components/";
import { getGame, startgame, playmove } from "../game/game.graphql";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { getGameQuery, startgameMutation, playmoveMutation } from "../../API";

type GameScreenNavigationProp = StackNavigationProp<StackNavigatorParams, "Game">;
type GameScreenRouteProp = RouteProp<StackNavigatorParams, "Game">;
type GameProps = {
	navigation: GameScreenNavigationProp;
	route: GameScreenRouteProp;
};
type GameType = getGameQuery["getGame"];

export default function Game({ navigation, route }: GameProps): ReactElement {
	const { gameID: existingGameID, invitee } = route.params;
	const [game, setGame] = useState<any>(null);
	const [gameID, setGameID] = useState<any>(null);

	const initGame = async () => {
		let gameID = existingGameID;
		try {
			if (!gameID) {
				const startgameRes = (await API.graphql(
					graphqlOperation(startgame, { invitee })
				)) as GraphQLResult<startgameMutation>;
				if (startgameRes.data?.startgame) {
					gameID = startgameRes.data.startgame.id;
				}
			}
			if (gameID) {
				const getGameRes = (await API.graphql(
					graphqlOperation(getGame, { id: gameID })
				)) as GraphQLResult<getGameQuery>;
				if (getGameRes.data?.getGame) {
					setGame(getGameRes.data?.getGame);
					setGameID(gameID);
				}
			}
		} catch (err) {
			Alert.alert("error", "error from game");
		}
	};

	const playTurn = async (index: number) => {
		try {
			const playMoveRes = (await API.graphql(
				graphqlOperation(playmove, { index, game: gameID })
			)) as GraphQLResult<playmoveMutation>;
			if (game && playMoveRes.data?.playmove) {
				const { status, state, winner, turn } = playMoveRes.data.playmove;
				setGame({ ...game, status, state, winner, turn });
			}
		} catch (err) {
			if (err.errors && err.errors.length > 0) {
				Alert.alert("Error!", err.errors[0].message);
				return;
			}
			Alert.alert("error", "error from game");
		}
	};

	useEffect(() => {
		initGame();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			{game && <Board onCellPress={(index) => playTurn(index)} state={game.state} size={400} />}
		</SafeAreaView>
	);
}
