const {regToString, getConstraintName} = require('>/src/helpers/');
const {TABLES, COLUMNS} = require('../constants');

const table = TABLES.USERS;

const emailRegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
const passwordRegExp = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!@_ %#~^*$&()?\-+=]).*$/;

const createTable = client => {
	const {id, username, email, password, created} = COLUMNS[table];
	const query = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS ${table} (
	${id} text PRIMARY KEY UNIQUE DEFAULT CONCAT('user-', gen_random_uuid()),
	${username} text UNIQUE NOT NULL CONSTRAINT ${getConstraintName(
		table,
		username
	)} CHECK (char_length(${username}) >= 3),
	${email} text UNIQUE NOT NULL CONSTRAINT ${getConstraintName(
		table,
		email
	)} CHECK (${email} ~* '${regToString(emailRegExp)}'),
	${password} text NOT NULL CONSTRAINT ${getConstraintName(
		table,
		password
	)} CHECK (
	${password} ~ '${regToString(passwordRegExp)}'),
	${created} timestamp NOT NULL DEFAULT NOW()
);
	`;
	return client.query(query);
};

const dropTable = async client =>
	client.query(`DROP TABLE IF EXISTS ${table};`);

module.exports = {createTable, dropTable};
