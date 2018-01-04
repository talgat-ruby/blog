const {
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLList,
	GraphQLID,
	GraphQLString
} = require('graphql');

const CommentType = require('./comment-type');

const PostType = new GraphQLObjectType({
	name: 'Post',
	fields: () => ({
		id: {type: new GraphQLNonNull(GraphQLID)},
		title: {type: new GraphQLNonNull(GraphQLString)},
		preview: {type: new GraphQLNonNull(GraphQLString)},
		content: {type: new GraphQLNonNull(GraphQLString)},
		comments: {
			type: new GraphQLList(CommentType),
			resolve: async ({id}, args, {db}) =>
				(await db.query(
					`SELECT * FROM ${
						db.constants.TABLES.COMMENTS
					} WHERE post_id='${id}' ORDER BY created`
				)).rows
		},
		created: {type: new GraphQLNonNull(GraphQLString)},
		updated: {type: new GraphQLNonNull(GraphQLString)}
	})
});
module.exports = PostType;
