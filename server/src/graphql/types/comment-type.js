const {ObjectID} = require('mongodb');
const {
	GraphQLNonNull,
	GraphQLID,
	GraphQLObjectType,
	GraphQLString
} = require('graphql');

const {COLLECTIONS} = require('../../constants/db-constants');

const UserType = require('./user-type');

const CommentType = new GraphQLObjectType({
	name: 'Comment',
	fields: () => ({
		_id: {type: new GraphQLNonNull(GraphQLID)},
		text: {type: new GraphQLNonNull(GraphQLString)},
		created: {type: new GraphQLNonNull(GraphQLString)},
		user: {
			type: UserType,
			resolve: ({userId}, parentValue, {db}) =>
				db.collection(COLLECTIONS.USERS).findOne({_id: ObjectID(userId)})
		}
	})
});
module.exports = CommentType;
