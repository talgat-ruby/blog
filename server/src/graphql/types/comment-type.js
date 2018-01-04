const {
	GraphQLNonNull,
	GraphQLID,
	GraphQLObjectType,
	GraphQLString
} = require('graphql');

const UserType = require('./user-type');

const CommentType = new GraphQLObjectType({
	name: 'Comment',
	fields: () => ({
		id: {type: new GraphQLNonNull(GraphQLID)},
		content: {type: new GraphQLNonNull(GraphQLString)},
		user: {
			type: UserType,
			resolve: async ({userId}, parentValue, {db}) =>
				(await db.query(
					`SELECT * FROM ${db.constants.TABLES.USERS} WHERE id='${userId}'`
				)).rows[0]
		},
		created: {type: new GraphQLNonNull(GraphQLString)},
		updated: {type: new GraphQLNonNull(GraphQLString)}
	})
});
module.exports = CommentType;
