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
const isTerminal = require("./isTerminal");

const getGame = gql`
	query getGame($id: ID!) {
		getGame(id: $id) {
			id
			turn
			state
			status
			winner
			owners
			initiator
		}
	}
`;

const updateGame = gql`
	mutation updateGame(
		$id: ID!
		$turn: String!
		$winner: String
		$status: GameStatus!
		$state: [Symbol]!
		$player: String!
	) {
		updateGame(
			input: { id: $id, turn: $turn, winner: $winner, status: $status, state: $state }
			condition: { turn: { eq: $player } }
		) {
			id
			turn
			state
			status
			winner
		}
	}
`;

exports.handler = async (event) => {
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

	const player = event.identity.username;
	const gameID = event.arguments.game;
	const index = event.arguments.index;

	const gameResponse = await graphqlClient.query({
		query: getGame,
		variables: {
			id: gameID,
		},
	});
	const game = gameResponse.data.getGame;
	if (!game) {
		throw new Error("Cant find game");
	}

	if (game.status !== "REQUESTED" && game.status !== "ACTIVE") {
		console.log("game not active");
		throw new Error("game not active");
	}

	if (!game.owners.includes(player)) {
		console.log("player not participating");
		throw new Error("player not participating in the game while logged in");
	}

	if (game.turn !== player) {
		console.log("not your turn");
		throw new Error("not your turn");
	}

	if (index > 8 || game.state[index]) {
		console.log("invalid index or cell already taken");
		throw new Error("invalid index or cell already taken");
	}

	const symbol = player === game.initiator ? "x" : "o";
	const nextTurn = game.owners.find((p) => p !== game.turn);
	const invitee = game.owners.find((p) => p !== game.intiator);
	const newState = [...game.state];
	newState[index] = symbol;
	let newStatus = "ACTIVE";
	let newWinner = null;

	const terminalState = isTerminal(newState);
	if (terminalState) {
		newStatus = "FINISHED";
		if (terminalState.winner === "x") {
			newWinner = game.initiator;
		}
		if (terminalState.winner === "o") {
			newWinner = invitee;
		}
	}

	const updateGameResponse = await graphqlClient.mutate({
		mutation: updateGame,
		variables: {
			id: gameID,
			turn: nextTurn,
			winner: newWinner,
			status: newStatus,
			state: newState,
			player: player,
		},
	});

	return updateGameResponse.data.updateGame;
};
