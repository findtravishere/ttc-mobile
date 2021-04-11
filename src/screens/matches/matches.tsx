import React, { ReactElement, useEffect, useState } from "react";
import { ScrollView, View, Alert, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { Text, Button } from "../../components";
import styles from "./matches.styles";
import { useLogged } from "../../contexts/logged-context";
import { getPlayer, PlayerGameType } from "./matches.graphql";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { GetPlayerQuery } from "../../API";
import MatchesItem from "./matches-item";

export default function Matches(): ReactElement {
	const { user } = useLogged();
	const [playerGames, setPlayerGames] = useState<PlayerGameType[] | null>(null);
	const [nextToken, setNextToken] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const fetchPlayer = async (nextToken: string | null) => {
		if (user) {
			if (nextToken == null) {
				setRefreshing(true);
			}
			try {
				const player = (await API.graphql(
					graphqlOperation(getPlayer, {
						username: user.username,
						limit: 2,
						sortDirection: "DESC",
						nextToken: nextToken,
					})
				)) as GraphQLResult<GetPlayerQuery>;
				if (player.data?.getPlayer?.games) {
					const newPlayerGames = player.data.getPlayer.games.items || [];
					setPlayerGames(
						!playerGames || nextToken == null ? newPlayerGames : [...playerGames, ...newPlayerGames]
					);
					setNextToken(player.data.getPlayer.games.nextToken);
				}
			} catch (err) {
				Alert.alert("Error!", "error has occured");
			}
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchPlayer(null);
	}, []);

	return (
		<ScrollView>
			{user ? (
				<>
					<FlatList
						contentContainerStyle={styles.container}
						data={playerGames}
						renderItem={({ item }) => <MatchesItem playerGame={item} />}
						keyExtractor={(playerGames) => (playerGames ? playerGames.game.id : `${new Date().getTime()}`)}
						ListEmptyComponent={() => (
							<View>
								<Text>No matches found</Text>
							</View>
						)}
						ListFooterComponent={() => {
							if (!nextToken) return null;
							return (
								<Button
									style={{ alignItems: "center" }}
									title="Load More Matches"
									onPress={() => fetchPlayer(nextToken)}
								></Button>
							);
						}}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchPlayer(null)} />}
					/>
					<TouchableOpacity
						style={{ alignItems: "center", borderColor: "green", borderWidth: 5, padding: 20 }}
					>
						<Text style={{ fontSize: 17 }}>NEW GAME</Text>
					</TouchableOpacity>
				</>
			) : (
				<View>you are not logged in</View>
			)}
		</ScrollView>
	);
}
