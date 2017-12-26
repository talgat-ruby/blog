const jwt = require('jsonwebtoken');
const {GraphQLNonNull, GraphQLObjectType, GraphQLString} = require('graphql');

const {AUTH_SECRET_KEY} = require('../../constants/app-constants');

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		username: {type: new GraphQLNonNull(GraphQLString)},
		email: {type: new GraphQLNonNull(GraphQLString)},
		token: {
			type: new GraphQLNonNull(GraphQLString),
			resolve: ({_id}) => jwt.sign({_id}, AUTH_SECRET_KEY)
		}
	})
});
module.exports = UserType;
