const {ObjectID} = require('mongodb');
const {
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLList,
	GraphQLID,
	GraphQLString
} = require('graphql');

const {COLLECTIONS} = require('../../constants/db-constants');

const CommentType = require('./comment-type');

const PostType = new GraphQLObjectType({
	name: 'Post',
	fields: () => ({
		_id: {type: new GraphQLNonNull(GraphQLID)},
		title: {type: new GraphQLNonNull(GraphQLString)},
		preview: {type: new GraphQLNonNull(GraphQLString)},
		created: {type: new GraphQLNonNull(GraphQLString)},
		templateName: {type: new GraphQLNonNull(GraphQLString)},
		comments: {
			type: new GraphQLList(CommentType),
			resolve: ({_id}, args, {db}) =>
				db
					.collection(COLLECTIONS.COMMENTS)
					.find({postId: ObjectID(_id)})
					.sort({_id: -1})
					.toArray()
		}
	})
});
module.exports = PostType;
