const jwt = require('jsonwebtoken');
const {
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLList,
	GraphQLID,
	GraphQLInt
} = require('graphql');

const {UserType, PostType} = require('./types/');

const query = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		user: {
			type: UserType,
			resolve: async (
				parentValue,
				args,
				{db, request: {header: {authorization}}}
			) => {
				try {
					//  TODO: const {id} = jwt.verify(authorization, process.env.AUTH_SECRET_KEY);
					return (await db.query(`SELECT * FROM ${db.constants.TABLES.USERS}`)) // TODO: WHERE id='${id}'
						.rows[0];
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
			resolve: async (parentValue, {offset, limit}, {db}) =>
				(await db.query(
					`SELECT * FROM ${db.constants.TABLES.POSTS}
					ORDER BY created 
					LIMIT ${limit} 
					OFFSET ${offset}`
				)).rows
		},
		post: {
			type: PostType,
			args: {
				id: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve: async (parentValue, {id}, {db}) =>
				(await db.query(
					`SELECT * FROM ${db.constants.TABLES.POSTS} WHERE id='${id}'`
				)).rows[0]
		}
	}
});
module.exports = query;
