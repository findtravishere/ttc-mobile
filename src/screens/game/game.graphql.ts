import gql from "graphql-tag";

export const getGame = gql`
	query getGame($id: ID!) {
		getGame(id: $id) {
			id
			status
			owners
			initiator
			turn
			state
			winner
			players {
				items {
					player {
						username
						name
					}
				}
			}
		}
	}
`;

export const startgame = gql`
	mutation startgame($invitee: String!) {
		startgame(invitee: $invitee) {
			id
		}
	}
`;

export const playmove = gql`
	mutation playmove($game: ID!, $index: Int!) {
		playmove(game: $game, index: $index) {
			id
			status
			turn
			state
			winner
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
