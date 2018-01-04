const jwt = require('jsonwebtoken');
const {GraphQLNonNull, GraphQLObjectType, GraphQLString} = require('graphql');

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		username: {type: new GraphQLNonNull(GraphQLString)},
		email: {type: new GraphQLNonNull(GraphQLString)},
		token: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({id}) => jwt.sign({id}, process.env.AUTH_SECRET_KEY)
		},
		created: {type: new GraphQLNonNull(GraphQLString)},
		updated: {type: new GraphQLNonNull(GraphQLString)}
	})
});
module.exports = UserType;
