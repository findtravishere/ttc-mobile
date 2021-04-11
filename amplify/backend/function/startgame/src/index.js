/* Amplify Params - DO NOT EDIT
	API_TTC_GRAPHQLAPIENDPOINTOUTPUT
	API_TTC_GRAPHQLAPIIDOUTPUT
	API_TTC_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const appsync = require("aws-appsync");
const gql = require("graphql-tag");
require("cross-fetch/polyfill");

exports.handler = async (event, context, callback) => {
	const graphqlClient = new appsync.AWSAppSyncClient({
		url: process.env.API_TTC_GRAPHQLAPIENDPOINTOUTPUT,
		region: process.env.REGION,
		auth: {
			type: "AWS_IAM",
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				sessionToken: process.env.AWS_SESSION_TOKEN,
			},
		},
		disableOffline: true,
	});

	const initiator = event.identity.username;
	const invitee = event.arguments.invitee;

	const playerQuery = gql`
		query getPlayer($username: String!) {
			getPlayer(username: $username) {
				id
			}
		}
	`;

	const initiatorResponse = await graphqlClient.query({
		query: playerQuery,
		variables: {
			username: initiator,
		},
	});

	const inviteeResponse = await graphqlClient.query({
		query: playerQuery,
		variables: {
			username: invitee,
		},
	});

	if (!initiatorResponse.data.getPlayer || !inviteeResponse.data.getPlayer) {
		console.log("At least 1 player does not exist!");
		throw new Error("At least 1 player does not exist!");
	}

	if (initiatorResponse.data.getPlayer.id === inviteeResponse.data.getPlayer.id) {
		console.log("Can't self invite");
		throw new Error("Can't self invite");
	}

	const gameMutation = gql`
		mutation createGame(
			$status: GameStatus!
			$owners: [String!]!
			$initiator: String!
			$turn: String!
			$state: [Symbol]!
		) {
			createGame(input: { status: $status, owners: $owners, initiator: $initiator, turn: $turn, state: $state }) {
				id
				state
				status
				turn
				winner
			}
		}
	`;

	const gameResponse = await graphqlClient.mutate({
		mutation: gameMutation,
		variables: {
			status: "REQUESTED",
			owners: [initiator, invitee],
			initiator: initiator,
			turn: Math.random() < 0.5 ? initiator : invitee,
			state: [null, null, null, null, null, null, null, null, null],
		},
	});

	const playerGameMutation = gql`
		mutation createPlayerGame($gameID: ID!, $playerUsername: String!, $owners: [String!]!) {
			createPlayerGame(input: { gameID: $gameID, playerUsername: $playerUsername, owners: $owners }) {
				id
			}
		}
	`;

	const initiatorPlayerGameResponse = await graphqlClient.mutate({
		mutation: playerGameMutation,
		variables: {
			gameID: gameResponse.data.createGame.id,
			playerUsername: initiator,
			owners: [initiator, invitee],
		},
	});
	const inviteePlayerGameResponse = await graphqlClient.mutate({
		mutation: playerGameMutation,
		variables: {
			gameID: gameResponse.data.createGame.id,
			playerUsername: invitee,
			owners: [initiator, invitee],
		},
	});

	return {
		id: gameResponse.data.createGame.id,
		status: gameResponse.data.createGame.status,
		turn: gameResponse.data.createGame.turn,
		state: gameResponse.data.createGame.state,
		winner: gameResponse.data.createGame.winner,
	};
};
