const {TABLES} = require('../constants');

const tables = {
	[TABLES.USERS]: require('./users-table'),
	[TABLES.POSTS]: require('./posts-table'),
	[TABLES.COMMENTS]: require('./comments-table')
};
const errors = {
	[TABLES.USERS]: require('./users-table.errors'),
	[TABLES.POSTS]: require('./posts-table.errors'),
	[TABLES.COMMENTS]: require('./comments-table.errors')
};

const createTables = client =>
	Promise.all(
		Object.values(tables).map(({createTable}) => createTable(client))
	);

const dropTables = client =>
	Promise.all([
		tables[TABLES.POSTS].dropTable(client),
		tables[TABLES.USERS].dropTable(client)
	]);

module.exports = {createTables, dropTables, errors};
