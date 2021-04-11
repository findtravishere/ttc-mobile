import React, { ReactElement, useEffect, useState, useRef } from "react";
import { TouchableOpacity, Animated } from "react-native";
import { Text } from "../../components";
import { useLogged } from "../../contexts/logged-context";
import { PlayerGameType, onUpdateGameById } from "./matches.graphql";
import { API, graphqlOperation } from "aws-amplify";
import Observable from "zen-observable";

type MatchesItemProps = {
    playerGame: PlayerGameType;
    onPress: () => void;
};

export default function MatchesItem({
    playerGame: playerGameProp,
    onPress
}: MatchesItemProps): ReactElement | null {
    const { user } = useLogged();
    const [playerGame, setPlayerGame] = useState(playerGameProp);
    const animationRef = useRef<Animated.Value>(new Animated.Value(0));

    const getResult = (playerGame: PlayerGameType): "win" | "loss" | "draw" | false => {
        if (!playerGame || !user) return false;
        const game = playerGame.game;
        if (game.status !== "FINISHED") return false;
        const opponent = game?.players?.items?.find(
            playerGame => playerGame?.player.username !== user.username
        );
        if (game.winner === user.username) return "win";
        if (game.winner === opponent?.player.username) return "loss";
        if (game.winner === null) return "draw";
        return false;
    };

    const game = playerGame?.game;
    if (!user || !playerGame) return null;
    const result = getResult(playerGame);
    const opponent = game?.players?.items?.find(playerGame => playerGame?.player.username !== user.username);

    useEffect(() => {
        if (game && (game.status === "REQUESTED" || game.status === "ACTIVE")) {
            const gameUpdates = (API.graphql(
                graphqlOperation(onUpdateGameById, {
                    id: game.id
                })
            ) as unknown) as Observable<{ [key: string]: any }>;
            const subscription = gameUpdates.subscribe({
                next: ({ value }) => {
                    console.log(value);
                    const newGame = value.data.onUpdateGameById;
                    if (newGame) {
                        setPlayerGame({ ...playerGame, ["game"]: { ...playerGame?.game, ...newGame } });
                        if (newGame.status === "FINISHED") {
                            subscription.unsubscribe();
                        }
                        Animated.sequence([
                            Animated.timing(animationRef.current, {
                                toValue: 1,
                                duration: 500,
                                useNativeDriver: false
                            }),
                            Animated.delay(1000),
                            Animated.timing(animationRef.current, {
                                toValue: 0,
                                duration: 500,
                                useNativeDriver: false
                            })
                        ]).start();
                    }
                }
            });
            return () => {
                subscription.unsubscribe;
            };
        }
    }, []);
    return (
        <TouchableOpacity
            onPress={() => {
                onPress();
            }}
            style={{ marginBottom: 20, alignItems: "center" }}
        >
            <Animated.View
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: animationRef.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["orange", "yellow"]
                    })
                }}
            />
            <Text>
                {opponent?.player.name} ({opponent?.player.username})
            </Text>
            {(game?.status === "REQUESTED" || game?.status === "ACTIVE") && (
                <Text>
                    {game.turn === user.username ? "Your Turn" : `Waiting for ${opponent?.player.username}`}
                </Text>
            )}
            {result && (
                <Text style={{ textAlign: "center" }}>
                    {result === "win" && "You Won!"}
                    {result === "loss" && "You Lost!"}
                    {result === "draw" && "Draw!"}
                </Text>
            )}
        </TouchableOpacity>
    );
}
