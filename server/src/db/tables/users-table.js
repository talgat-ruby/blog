const {TABLES} = require('../constants');

const passwordRegExp =
	'(?=(.*[0-9]))(?=.*[!@#$%^&*()\\[]{}-_+=~`|:;"\'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}';

const createTable = async client => {
	try {
		const res = await client.query(`CREATE TABLE ${TABLES.USERS} (
			id 				SERIAL PRIMARY KEY,
			username 	text UNIQUE NOT NULL,
			email 		text UNIQUE NOT NULL,
			password 	text NOT NULL CHECK(password ~ ${passwordRegExp})
		);`);
	} catch (e) {
		return Promise.reject(e);
	}
};

const dropTable = async client => {
	try {
		const res = await client.query(`DROP TABLE IF EXISTS ${TABLES.USERS};`);
	} catch (e) {
		return Promise.reject(e);
	}
};

module.exports = {createTable, dropTable};
