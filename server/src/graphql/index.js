const {GraphQLSchema} = require('graphql');

const query = require('./query');
const mutation = require('./mutations');

const schema = new GraphQLSchema({
	query,
	mutation
});
module.exports = schema;
