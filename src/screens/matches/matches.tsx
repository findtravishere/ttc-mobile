import React, { ReactElement, useEffect, useState } from "react";
import { ScrollView, View, Alert, FlatList, TouchableOpacity, RefreshControl, Dimensions } from "react-native";
import { Text, Button } from "../../components";
import styles from "./matches.styles";
import { useLogged } from "../../contexts/logged-context";
import { getPlayer, PlayerGameType } from "./matches.graphql";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api";
import { GetPlayerQuery } from "../../API";
import MatchesItem from "./matches-item";
import Modal from "react-native-modal";
import PlayersModal from "./players-modal/players-modal";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "../../config/navigator";

type MatchesNavigationProp = StackNavigationProp<StackNavigatorParams, "Matches">;
type MatchesProps = {
	navigation: MatchesNavigationProp;
};

export default function Matches({ navigation }: MatchesProps): ReactElement {
	const { user } = useLogged();
	const [playerGames, setPlayerGames] = useState<PlayerGameType[] | null>(null);
	const [nextToken, setNextToken] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [playersModal, setPlayersModal] = useState(false);

	const fetchPlayer = async (nextToken: string | null) => {
		if (user) {
			if (nextToken == null) {
				setRefreshing(true);
			}
			try {
				const player = (await API.graphql(
					graphqlOperation(getPlayer, {
						username: user.username,
						limit: 10,
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
						renderItem={({ item }) => (
							<MatchesItem
								onPress={() => {
									if (item?.game) {
										navigation.navigate("Game", { gameID: item?.game.id });
									}
								}}
								playerGame={item}
							/>
						)}
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
						onPress={() => setPlayersModal(true)}
						style={{ alignItems: "center", borderColor: "green", borderWidth: 5, padding: 20 }}
					>
						<Text style={{ fontSize: 17, alignItems: "center" }}>NEW GAME</Text>
					</TouchableOpacity>
				</>
			) : (
				<View>you are not logged in</View>
			)}
			<Modal
				style={{ margin: 0 }}
				isVisible={playersModal}
				backdropOpacity={0.75}
				onBackdropPress={() => setPlayersModal(false)}
				onBackButtonPress={() => setPlayersModal(false)}
			>
				<PlayersModal
					onItemPress={(username) => {
						console.log(username);
						setPlayersModal(false);
						navigation.navigate("Game", { invitee: username });
					}}
				/>
			</Modal>
		</ScrollView>
	);
}
