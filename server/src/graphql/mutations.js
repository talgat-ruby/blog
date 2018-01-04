const jwt = require('jsonwebtoken');
const {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLID,
	GraphQLString
} = require('graphql');

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
				try {
					const user = (await db.query(`
						SELECT id, username, email, created, updated
						FROM ${db.constants.TABLES.USERS} 
						WHERE email='${email}' AND password=crypt('${password}', password);
					`)).rows[0];

					if (user) {
						return user;
					} else {
						throw new Error('Invalid credentials');
					}
				} catch (e) {
					return Promise.reject(e);
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
				try {
					return (await db.query(`
						INSERT INTO ${db.constants.TABLES.USERS} (username, email, password)
						VALUES ('${username}', '${email}', '${password}')
						RETURNING id, username, email, created, updated;
					`)).rows[0];
				} catch (e) {
					console.log('\x1b[33m error -> \x1b[0m', Object.assign({}, e));
					const constraint = e.constraint;

					return Promise.reject(e);
				}
			}
		}
		// addComment: {
		// 	type: CommentType,
		// 	args: {
		// 		postId: {type: new GraphQLNonNull(GraphQLID)},
		// 		text: {type: new GraphQLNonNull(GraphQLString)}
		// 	},
		// 	resolve: async (
		// 		parentValue,
		// 		{postId, text},
		// 		{db, request: {header: {authorization}}}
		// 	) => {
		// 		try {
		// 			const {_id} = jwt.verify(authorization, AUTH_SECRET_KEY);
		// 			const user = await db
		// 				.collection(COLLECTIONS.USERS)
		// 				.findOne({_id: ObjectID(_id)});
		// 			if (user) {
		// 				const {ops: [data]} = await db
		// 					.collection(COLLECTIONS.COMMENTS)
		// 					.insertOne({
		// 						text,
		// 						created: new Date().toJSON(),
		// 						userId: user._id,
		// 						postId: ObjectID(postId)
		// 					});
		// 				return data;
		// 			} else {
		// 				throw new Error('User not found!');
		// 			}
		// 		} catch (e) {
		// 			if (e && e.message) {
		// 				return new Error(e.message);
		// 			} else {
		// 				return new Error('Smth went wrong!');
		// 			}
		// 		}
		// 	}
		// }
	}
});
module.exports = mutations;
