// const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLID,
	GraphQLString
} = require('graphql');

const {AUTH_SECRET_KEY} = require('../constants/app-constants');
const {COLLECTIONS} = require('../constants/db-constants');

const {UserType, CommentType} = require('./types/');

const mutations = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		login: {
			type: UserType,
			args: {
				email: {type: new GraphQLNonNull(GraphQLString)},
				password: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve: async (parentValue, {email, password}, {db}) => {
				const user = await db.collection(COLLECTIONS.USERS).findOne({email});
				if (user && password === user.password) {
					return user;
				} else {
					throw new Error('Invalid credentials');
				}
			}
		},
		signUp: {
			type: UserType,
			args: {
				username: {type: new GraphQLNonNull(GraphQLString)},
				email: {type: new GraphQLNonNull(GraphQLString)},
				password: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve: async (parentValue, {username, email, password}, {db}) => {
				const usersCollection = db.collection(COLLECTIONS.USERS);

				const isUsernameExist = Boolean(
					await usersCollection.findOne({username})
				);
				if (isUsernameExist) {
					throw new Error('Username is already exists');
				}

				const isEmailExist = Boolean(await usersCollection.findOne({email}));
				if (isEmailExist) {
					throw new Error('Email is already exists');
				}

				const {ops: [data]} = await usersCollection.insertOne({
					username,
					email,
					password
				});
				return data;
			}
		},
		addComment: {
			type: CommentType,
			args: {
				postId: {type: new GraphQLNonNull(GraphQLID)},
				text: {type: new GraphQLNonNull(GraphQLString)}
			},
			resolve: async (
				parentValue,
				{postId, text},
				{db, request: {header: {authorization}}}
			) => {
				try {
					const {_id} = jwt.verify(authorization, AUTH_SECRET_KEY);
					const user = await db
						.collection(COLLECTIONS.USERS)
						.findOne({_id: ObjectID(_id)});
					if (user) {
						const {ops: [data]} = await db
							.collection(COLLECTIONS.COMMENTS)
							.insertOne({
								text,
								created: new Date().toJSON(),
								userId: user._id,
								postId: ObjectID(postId)
							});
						return data;
					} else {
						throw new Error('User not found!');
					}
				} catch (e) {
					if (e && e.message) {
						return new Error(e.message);
					} else {
						return new Error('Smth went wrong!');
					}
				}
			}
		}
	}
});
module.exports = mutations;
