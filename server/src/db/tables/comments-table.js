const {regToString, getConstraintName} = require('>/src/helpers/');
const {TABLES, COLUMNS} = require('../constants');

const table = TABLES.COMMENTS;

const createTable = client => {
	const {id, user_id, post_id, content, created, updated} = COLUMNS[table];
	const query = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS ${table} (
	${id} text PRIMARY KEY UNIQUE DEFAULT CONCAT('comment-', gen_random_uuid()),
	${user_id} text REFERENCES ${TABLES.USERS} ON DELETE CASCADE,
	${post_id} text REFERENCES ${TABLES.POSTS} ON DELETE CASCADE,
	${content} text NOT NULL,
	${created} timestamp NOT NULL DEFAULT NOW(),
	${updated} timestamp NOT NULL DEFAULT NOW()
);
	`;
	return client.query(query);
};

const dropTable = client => client.query(`DROP TABLE IF EXISTS ${table};`);

module.exports = {createTable, dropTable};
