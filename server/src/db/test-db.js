const {TABLES} = require('./constants');

module.exports = async client => {
	try {
		await client.query(`
			INSERT INTO ${TABLES.USERS} VALUES (123, admin, admin@email.com, 1523);
		`);
	} catch (e) {
		Promise.reject(e);
	}
};
