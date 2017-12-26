const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLList,
	GraphQLID,
	GraphQLInt
} = require('graphql');

const {AUTH_SECRET_KEY} = require('>/src/constants/app-constants');
const {COLLECTIONS} = require('>/src/constants/db-constants');

const {UserType, PostType} = require('./types/');

const query = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		user: {
			type: UserType,
			resolve: (
				parentValue,
				args,
				{db, request: {header: {authorization}}}
			) => {
				try {
					const {_id} = jwt.verify(authorization, AUTH_SECRET_KEY);
					return db.collection(COLLECTIONS.USERS).findOne({_id: ObjectID(_id)});
				} catch (e) {
					return Promise.reject(e);
				}
			}
		},
		posts: {
			type: new GraphQLList(PostType),
			args: {
				limit: {type: new GraphQLNonNull(GraphQLInt)},
				offset: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve: (parentValue, {offset, limit}, {db}) =>
				db
					.collection(COLLECTIONS.POSTS)
					.find()
					.skip(offset)
					.limit(limit)
					.sort({_id: -1})
					.toArray()
		},
		post: {
			type: PostType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve: (parentValue, {id}, {db}) =>
				db.collection(COLLECTIONS.POSTS).findOne({_id: ObjectID(id)})
		}
	}
});
module.exports = query;
