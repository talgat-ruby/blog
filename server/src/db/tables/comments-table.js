const {TABLES} = require('../constants');

const createTable = async client => {
	try {
		const res = await client.query(`CREATE TABLE ${TABLES.COMMENTS} (
			username text,
			email text,
			password text
		);`);

		console.log('\x1b[33m res -> \x1b[0m', res);
	} catch (e) {
		return Promise.reject(e);
	}
};

const dropTable = async client => {
	try {
		const res = await client.query(`DROP TABLE ${TABLES.COMMENTS};`);

		console.log('\x1b[33m res -> \x1b[0m', res);
	} catch (e) {
		return Promise.reject(e);
	}
};

module.exports = {createTable, dropTable};
