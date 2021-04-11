import gql from "graphql-tag";
import { GetPlayerQuery } from "../../API";

export const getPlayer = gql`
	query getPlayer($username: String!, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
		getPlayer(username: $username) {
			games(limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
				items {
					id
					game {
						id
						initiator
						owners
						status
						turn
						winner
						players {
							items {
								player {
									name
									username
								}
							}
						}
					}
				}
				nextToken
			}
		}
	}
`;

export const onUpdateGameById = gql`
	subscription onUpdateGameById($id: ID!) {
		onUpdateGameById(id: $id) {
			id
			status
			turn
			state
			winner
		}
	}
`;

export type PlayerGamesType = Exclude<Exclude<GetPlayerQuery["getPlayer"], null>["games"], null>["items"];
export type PlayerGameType = Exclude<PlayerGamesType, null>[0];
