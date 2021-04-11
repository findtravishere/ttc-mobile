import React, { ReactElement, useEffect, useState } from "react";
import { View, Dimensions, Alert, TextInput, FlatList, TouchableOpacity } from "react-native";
import { Text } from "../../../components";
import { API, graphqlOperation } from "aws-amplify";
import { searchPlayers } from "../matches.graphql";
import { GraphQLResult } from "@aws-amplify/api";
import { searchPlayersQuery } from "../../../API";

type PlayerListType = Exclude<searchPlayersQuery["searchPlayers"], null>["items"];

type PlayersModalProps = {
	onItemPress: (username: string) => void;
};

export default function PlayersModal({ onItemPress }: PlayersModalProps): ReactElement {
	const [players, setPlayers] = useState<PlayerListType>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const fetchPlayers = async (searchString: string) => {
		try {
			const players = (await API.graphql(
				graphqlOperation(searchPlayers, {
					limit: 10,
					searchString,
				})
			)) as GraphQLResult<searchPlayersQuery>;
			if (players.data?.searchPlayers?.items) {
				setPlayers(players.data.searchPlayers.items);
				console.log(players.data.searchPlayers.items);
			}
		} catch (err) {
			Alert.alert("error!", "error from players modal");
		}
	};
	useEffect(() => {
		fetchPlayers("player");
	}, []);
	return (
		<View
			style={{
				height: Dimensions.get("screen").height * 0.6,
				marginTop: Dimensions.get("screen").height * 0.4,
			}}
		>
			<View style={{ padding: 30, backgroundColor: "grey" }}>
				<TextInput
					value={searchQuery}
					onChangeText={(text) => setSearchQuery(text)}
					onSubmitEditing={() => fetchPlayers(searchQuery)}
					placeholder="Type here to search players by username or name"
					returnKeyType="search"
				></TextInput>
			</View>
			<View style={{ flex: 1 }}>
				<FlatList
					contentContainerStyle={{ padding: 15 }}
					data={players}
					keyExtractor={(player) => player?.username || `${new Date().getTime()}`}
					ListEmptyComponent={() => {
						return (
							<View>
								<Text>NO PLAYERS FOUND</Text>
							</View>
						);
					}}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity
								onPress={() => {
									if (item) {
										onItemPress(item?.username);
									}
								}}
								style={{
									backgroundColor: "white",
									borderTopWidth: 1,
									borderColor: "blue",
									padding: 15,
									marginBottom: 15,
								}}
							>
								<Text style={{ color: "red", fontSize: 20 }}>{item?.name}</Text>
								<Text style={{ color: "red", fontSize: 13 }}>{item?.username}</Text>
							</TouchableOpacity>
						);
					}}
				/>
			</View>
		</View>
	);
}
