import React, { ReactElement, useEffect, useState } from "react";
import { SafeAreaView, Alert, View } from "react-native";
import styles from "./game.style";
import { RouteProp } from "@react-navigation/native";
import { StackNavigatorParams } from "../../navigation/navigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { Board, Button } from "../../components/";
import { getGame, startgame, playmove, onUpdateGameById } from "../game/game.graphql";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { getGameQuery, startgameMutation, playmoveMutation } from "../../API";
import Observable from "zen-observable";
import { useLogged } from "../../contexts/logged-context";
import { Text } from "../../components";

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
    const [playingTurn, setPlayingTurn] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | false>(false);
    const { user } = useLogged();
    const opponent = game && user && game.owners.find((x: string) => x !== user.username);

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

    const playTurn = async (index: any) => {
        setPlayingTurn(index);
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
            } else {
                Alert.alert("error", "error from game");
            }
        }
        setPlayingTurn(false);
    };

    useEffect(() => {
        if (gameID) {
            const gameUpdates = (API.graphql(
                graphqlOperation(onUpdateGameById, {
                    id: gameID
                })
            ) as unknown) as Observable<{ [key: string]: any }>;

            const subscription = gameUpdates.subscribe({
                next: ({ value }) => {
                    console.log(value);
                    const newGame = value.data.onUpdateGameById;
                    if (newGame && game) {
                        const { status, state, winner, turn } = newGame;
                        setGame({ ...game, status, state, winner, turn });
                    }
                }
            });
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [gameID]);

    useEffect(() => {
        initGame();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {game && user && (
                <>
                    <View
                        style={{
                            alignItems: "center",
                            borderColor: "black",
                            borderWidth: 3,
                            paddingBottom: 10,
                            paddingTop: 10,
                            paddingLeft: 10,
                            paddingRight: 10,
                            marginBottom: 30
                        }}
                    >
                        <Text style={{ fontSize: 20 }}>
                            {game.turn === user.username && game.status === "ACTIVE" && "YOUR TURN"}
                            {game.turn === opponent && game.status === "ACTIVE" && `${opponent}'s turn`}
                            {game.status === "FINISHED" && "GAME COMPLETED"}
                        </Text>
                    </View>
                    <Board
                        loading={playingTurn}
                        disabled={game.turn !== user.username || playingTurn !== false}
                        onCellPress={index => playTurn(index)}
                        state={game.state}
                        size={400}
                    />
                </>
            )}
            {game && user && game.status === "FINISHED" && (
                <View style={{ alignItems: "center", marginTop: 50 }}>
                    <Text
                        style={{
                            borderColor: "black",
                            borderWidth: 3,
                            paddingBottom: 10,
                            paddingTop: 10,
                            paddingLeft: 10,
                            paddingRight: 10,
                            marginBottom: 50
                        }}
                    >
                        {game.winner === user.username && "YOU WON!"}
                        {game.winner === opponent && "YOU LOST!"}
                        {game.winner === null && "DRAW"}
                    </Text>
                    <Button
                        onPress={() => {
                            if (opponent) {
                                navigation.replace("Game", { invitee: opponent });
                            }
                        }}
                        title="CHALLENGE TO A NEW GAME"
                    />
                </View>
            )}
        </SafeAreaView>
    );
}
