import React, { ReactElement, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../components";
import { useLogged } from "../../contexts/logged-context";
import { PlayerGameType, onUpdateGameById } from "./matches.graphql";
import { API, graphqlOperation } from "aws-amplify";
import Observable from "zen-observable";

export default function MatchesItem({ playerGame }: { playerGame: PlayerGameType }): ReactElement | null {
	const { user } = useLogged();
	const getResult = (playerGame: PlayerGameType): "win" | "loss" | "draw" | false => {
		if (!playerGame || !user) return false;
		const game = playerGame.game;
		if (game.status !== "FINISHED") return false;
		const opponent = game?.players?.items?.find((playerGame) => playerGame?.player.username !== user.username);
		if (game.winner === user.username) return "win";
		if (game.winner === opponent?.player.username) return "loss";
		if (game.winner === null) return "draw";
		return false;
	};

	const game = playerGame?.game;
	if (!user) return null;
	const result = getResult(playerGame);
	const opponent = game?.players?.items?.find((playerGame) => playerGame?.player.username !== user.username);

	useEffect(() => {
		if (game && (game.status === "REQUESTED" || game.status === "ACTIVE")) {
			const gameUpdates = (API.graphql(
				graphqlOperation(onUpdateGameById, {
					id: game.id,
				})
			) as unknown) as Observable<{ [key: string]: any }>;
			const subscription = gameUpdates.subscribe({
				next: ({ value }) => {
					console.log(value);
				},
			});
			return () => {
				subscription.unsubscribe;
			};
		}
	}, []);
	return (
		<TouchableOpacity style={{ marginBottom: 20, alignItems: "center" }}>
			<Text>
				{opponent?.player.name} ({opponent?.player.username})
			</Text>
			{(game?.status === "REQUESTED" || game?.status === "ACTIVE") && (
				<Text>{game.turn === user.username ? "Your Turn" : `Waiting for ${opponent?.player.username}`}</Text>
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
