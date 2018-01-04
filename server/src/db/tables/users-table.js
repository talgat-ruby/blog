const {regToString, constraint} = require('>/src/helpers/');
const {TABLES, COLUMNS} = require('../constants');

const table = TABLES.USERS;

const emailRegExp = /^[a-z0-9_%+.-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
const passwordRegExp = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!@_ %#~^*$&()?\-+=]).*$/;

const createTable = client => {
	const {id, username, email, password, created, updated} = COLUMNS[table];
	const query = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS ${table} (
	${id} text PRIMARY KEY UNIQUE DEFAULT CONCAT('user-', gen_random_uuid()),
	${username} text UNIQUE NOT NULL 
	CONSTRAINT ${constraint.getName(table, username)} 
	CHECK (char_length(${username}) >= 3),
	${email} text UNIQUE NOT NULL CONSTRAINT ${constraint.getName(
		table,
		email
	)} CHECK (${email} ~* '${regToString(emailRegExp)}'),
	${password} text,
	${created} timestamp NOT NULL DEFAULT NOW(),
	${updated} timestamp NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION encrypt_password_trigger() RETURNS TRIGGER 
AS $$
	BEGIN
		IF NEW.${password} ~ '${regToString(passwordRegExp)}' THEN
			NEW.${password} := crypt(NEW.${password}, gen_salt('bf', 8));
		ELSE
			RAISE check_violation 
			USING 
				TABLE = '${table}', 
				COLUMN = '${password}', 
				DATATYPE = 'text', 
				CONSTRAINT = '${constraint.getName(table, password)}',
				MESSAGE = 'new row for relation "${table}" violates check constraint "${constraint.getName(
		table,
		password
	)}"';
		END IF;
		RETURN NEW;
	END; 
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS encrypt_password ON ${table};

CREATE TRIGGER encrypt_password
BEFORE INSERT OR UPDATE ON ${table}
FOR EACH ROW
EXECUTE PROCEDURE encrypt_password_trigger();
	`;
	return client.query(query);
};

const dropTable = async client =>
	client.query(`DROP TABLE IF EXISTS ${table};`);

module.exports = {createTable, dropTable};
