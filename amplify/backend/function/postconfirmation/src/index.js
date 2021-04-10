/* Amplify Params - DO NOT EDIT
	API_TTC_GRAPHQLAPIENDPOINTOUTPUT
	API_TTC_GRAPHQLAPIIDOUTPUT
	API_TTC_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

exports.handler = async (event, context, callback) => {
	console.log("env", process.env);
	console.log("event", event);
	console.log("context", context);
	callback(null, event);
};
