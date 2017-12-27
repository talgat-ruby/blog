const {regToString, getConstraintName} = require('>/src/helpers/');
const {TABLES, COLUMNS} = require('../constants');

const table = TABLES.POSTS;

const createTable = client => {
	const {id, user_id, title, preview, content, created, updated} = COLUMNS[
		table
	];
	const query = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS ${table} (
	${id} text PRIMARY KEY UNIQUE DEFAULT CONCAT('post-', gen_random_uuid()),
	${user_id} text REFERENCES ${TABLES.USERS} ON DELETE CASCADE,
	${title} text UNIQUE NOT NULL,
	${preview} text NOT NULL CONSTRAINT ${getConstraintName(
		table,
		preview
	)} CHECK (char_length(${preview}) <= 150),
	${content} text NOT NULL,
	${created} timestamp NOT NULL DEFAULT NOW(),
	${updated} timestamp NOT NULL DEFAULT NOW()
)
	`;
	return client.query(query);
};

const dropTable = async client =>
	client.query(`DROP TABLE IF EXISTS ${table};`);

module.exports = {createTable, dropTable};
