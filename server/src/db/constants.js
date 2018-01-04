const TABLES = {
	USERS: 'users',
	POSTS: 'posts',
	COMMENTS: 'comments'
};
exports.TABLES = TABLES;

exports.COLUMNS = {
	[TABLES.USERS]: {
		id: 'id',
		username: 'username',
		email: 'email',
		password: 'password',
		created: 'created',
		updated: 'updated'
	},
	[TABLES.POSTS]: {
		id: 'id',
		user_id: 'user_id',
		title: 'title',
		preview: 'preview',
		content: 'content',
		created: 'created',
		updated: 'updated'
	},
	[TABLES.COMMENTS]: {
		id: 'id',
		user_id: 'user_id',
		post_id: 'post_id',
		content: 'content',
		created: 'created',
		updated: 'updated'
	}
};
